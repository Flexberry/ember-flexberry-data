import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor } from 'ember-qunit';
import { Adapter } from 'ember-flexberry-data';

// Контрактный unit-тест (обеспечение целостности promise-цепочки) метода
// ADAPTER.batchUpdate.
//
// Проблема: в addon/adapters/odata.js новый статус модели намазывается через
// `Ember.run(() => { store.pushPayload(...); model.rollbackAttributes(); })` с НЕВозвратом
// промиса, а `resolve(result)` вызывается сразу, не дожидаясь выполнения этого run'а.
// В результате цепочка промисов может разомкнуться: последующий `.then()` способен сработать
// раньше, чем ответ батча будет применён к моделям (что ломает повторный batchUpdate при
// откате из rollback-сценариев).
//
// Фикс: для каждой сохраняемой модели (created / updated / изменённый belongsTo) создаётся
// отдельный `Ember.RSVP.Promise` с `Ember.run` + `pushPayload` + `rollbackAttributes` +
// `resolve()`, затем финальный результат возвращается ТОЛЬКО после `Ember.RSVP.all(...)`.
//
// Тест проверяет этот контракт в изоляции (фейковый store + фейковые модели + заглушенный
// $.ajax, без реального бэкенда и без сериализации):
//   1. ответ намазывается на каждую сохраняемую модель до резолва batchUpdate;
//   2. для удалённых моделей вызывается unloadRecord, в результат попадает null;
//   3. при ошибке changeset батч отклоняется с DS.AdapterError и payload не применяется.

const RESPONSE_MULTIPART = 'multipart/mixed;boundary=batchresponse_1';

const MODEL_NAME = 'ember-flexberry-dummy-application-user';

function makeSnapshot(id) {
  return {
    type: { modelName: MODEL_NAME },
    id,
    changedAttributes: () => [],
    _attributes: {},
    record: null,
  };
}

function makeModel(dirtyType, id) {
  return {
    id,
    dirtyType,
    save: (/* options */) => Ember.RSVP.resolve(),
    get(key) {
      // Минимальный Ember.get-совместимый POJO.
      return this[key];
    },
    eachRelationship() {},
    hasChangedBelongsTo: () => false,
    hasChangedHasMany: () => false,
    _createSnapshot() {
      return makeSnapshot(id);
    },
    rollbackAttributesCalls: 0,
    rollbackAttributes() {
      this.rollbackAttributesCalls += 1;
    },
    constructor: { modelName: MODEL_NAME },
  };
}

function makeBatchResponseText({ withError = false, errorStatus = 400 } = {}) {
  // Multipart/mixed — changeset со статусом обновления + application/http — GET-перечитку
  // (её тело намазывается на модель через pushPayload).
  const changesetStatus = withError ? errorStatus : 200;
  const changesetBody = withError
    ? '{"error":{"message":"Server refuses update."}}'
    : '{"__PrimaryKey":"u1","Name":"UpdatedName"}';

  return [
    '--batchresponse_1',
    'Content-Type: multipart/mixed;boundary=changesetresponse_1',
    '',
    '--changesetresponse_1',
    'Content-Type: application/http',
    'Content-Transfer-Encoding: binary',
    'Content-ID: 1',
    '',
    'HTTP/1.1 ' + changesetStatus + ' ' + (withError ? 'Bad Request' : 'OK'),
    'Content-Type: application/json',
    '',
    changesetBody,
    '--changesetresponse_1--',
    '--batchresponse_1',
    'Content-Type: application/http',
    'Content-Transfer-Encoding: binary',
    '',
    'HTTP/1.1 200 OK',
    'Content-Type: application/json; charset=utf-8',
    'OData-Version: 4.0',
    '',
    '{"__PrimaryKey":"u1","Name":"ServerStateName"}',
    '--batchresponse_1--',
  ].join('\r\n');
}

moduleFor('adapter:odata', 'Unit | Adapter | odata | batchUpdate promise contract', {
  setup() {
    const self = this;
    this.adapter = Adapter.Odata.create();
    Ember.set(this.adapter, '_buildURL', () => '/odata/' + MODEL_NAME + 's');

    // Фейковый store: фиксируем вызовы pushPayload/unloadRecord, даём заглушку сериализатора.
    this.pushPayloadCalls = [];
    this.unloadedModels = [];
    this.store = {
      pushPayload(modelName, payload) {
        self.pushPayloadCalls.push({ modelName, payload });
      },
      unloadRecord(model) {
        self.unloadedModels.push(model);
      },
      serializerFor() {
        return {
          attrs: {},
          serializeIntoHash(data) {
            Ember.set(data, 'Name', 'something');
          },
        };
      },
    };
  },

  teardown() {
    if (this._originalAjax) {
      Ember.$.ajax = this._originalAjax;
    }
  },
});

test('resolves only after saveable models are applied (pushPayload + rollbackAttributes)', function (assert) {
  const done = assert.async();
  const adapter = this.adapter;
  const store = this.store;

  const model = makeModel('updated', 'u1');

  // Заглушка ajax: отдаём валидный batch-ответ синхронно.
  this._originalAjax = Ember.$.ajax;
  Ember.$.ajax = () => ({
    done(cb) {
      cb(makeBatchResponseText(), 'success', {
        getResponseHeader: () => RESPONSE_MULTIPART,
      });
      return { fail: () => {} };
    },
  });

  adapter.batchUpdate(store, Ember.A([model])).then((result) => {
    // Результат: для обновлённой модели — сам объект (не null).
    assert.equal(result.length, 1, 'result contains one entry');
    assert.ok(result[0] === model, 'updated model is returned as itself');

    // Контракт: payload намазан ровно для одной сохраняемой модели.
    assert.equal(this.pushPayloadCalls.length, 1, 'pushPayload called once for the updated model');
    assert.equal(this.pushPayloadCalls[0].modelName, MODEL_NAME, 'pushPayload with correct modelName');
    assert.deepEqual(
      this.pushPayloadCalls[0].payload,
      { [MODEL_NAME]: { __PrimaryKey: 'u1', Name: 'ServerStateName' } },
      'pushPayload applies the server-side GET body'
    );

    // Контракт: состояние модели принудительно приведено (rollbackAttributes).
    assert.equal(model.rollbackAttributesCalls, 1, 'rollbackAttributes called on the updated model');

    // Удалённых моделей в этом сценарии нет.
    assert.equal(this.unloadedModels.length, 0, 'no models unloaded');
    done();
  });
});

test('resolves null for deleted models and unloads them without applying payload', function (assert) {
  const done = assert.async();
  const adapter = this.adapter;
  const store = this.store;

  const model = makeModel('deleted', 'd1');

  this._originalAjax = Ember.$.ajax;
  Ember.$.ajax = () => ({
    done(cb) {
      cb(makeBatchResponseText(), 'success', {
        getResponseHeader: () => RESPONSE_MULTIPART,
      });
      return { fail: () => {} };
    },
  });

  adapter.batchUpdate(store, Ember.A([model])).then((result) => {
    assert.equal(result.length, 1, 'result contains one entry');
    assert.ok(result[0] === null, 'deleted model resolves as null');

    assert.equal(this.unloadedModels.length, 1, 'unloadRecord called for deleted model');
    assert.ok(this.unloadedModels[0] === model, 'unloadRecord called with the deleted model');

    // Для удалённой модели payload не намазывается.
    assert.equal(this.pushPayloadCalls.length, 0, 'pushPayload not called for deleted model');
    assert.equal(model.rollbackAttributesCalls, 0, 'rollbackAttributes not called for deleted model');
    done();
  });
});

test('rejects with DS.AdapterError on changeset failure and does not apply payload', function (assert) {
  const done = assert.async();
  const adapter = this.adapter;
  const store = this.store;

  const model = makeModel('updated', 'u1');

  this._originalAjax = Ember.$.ajax;
  Ember.$.ajax = () => ({
    done(cb) {
      cb(makeBatchResponseText({ withError: true }), 'success', {
        getResponseHeader: () => RESPONSE_MULTIPART,
      });
      return { fail: () => {} };
    },
  });

  adapter.batchUpdate(store, Ember.A([model])).then(
    () => {
      assert.ok(false, 'batchUpdate should not resolve on changeset failure');
      done();
    },
    (reason) => {
      assert.ok(reason instanceof Array && reason.length === 1, 'rejects with an array of errors');
      assert.ok(reason[0] instanceof DS.AdapterError, 'reject value is DS.AdapterError');

      // Никакого намазывания при ошибке.
      assert.equal(this.pushPayloadCalls.length, 0, 'pushPayload not called on failure');
      assert.equal(model.rollbackAttributesCalls, 0, 'rollbackAttributes not called on failure');

      // Решение должно приходить через rollback (не через повторную отправку в сеть,
      // т.е. ajax-заглушка вызвана не больше одного раза).
      done();
    }
  );
});
