import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleFor('service:syncer', 'Unit | Service | syncer', {
  needs: [
    'model:ember-flexberry-dummy-application-user',
  ],

  beforeEach() {
    App = startApp();
  },

  afterEach() {
    Ember.run(App, 'destroy');
  },
});

test('it exists', function(assert) {
  let service = this.subject(App.__container__.ownerInjection());
  assert.ok(service, 'Syncer exists.');
});

test('operation type from dirty type', function(assert) {
  let syncer = this.subject(App.__container__.ownerInjection());

  assert.equal(syncer._getOperationType('created'), 'INSERT', `'created' === 'INSERT'`);
  assert.equal(syncer._getOperationType('updated'), 'UPDATE', `'updated' === 'UPDATE'`);
  assert.equal(syncer._getOperationType('deleted'), 'DELETE', `'deleted' === 'DELETE'`);
  assert.throws(() => {
    syncer._getOperationType();
    syncer._getOperationType('');
    syncer._getOperationType('other');
  }, Error('Unknown dirty type.'), 'Other dirty type throw error.');
});

test('changes from record', function(assert) {
  let syncer = this.subject(App.__container__.ownerInjection());
  let store = App.__container__.lookup('service:store');

  Ember.run(() => {
    let record = store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'name',
      eMail: 'eMail',
      phone1: 'phone1',
      activated: false,
      vK: 'vK',
      vip: true,
      karma: 100,
    });

    assert.deepEqual(syncer._changesFromRecord(record), {
      name: [undefined, 'name'],
      eMail: [undefined, 'eMail'],
      phone1: [undefined, 'phone1'],
      activated: [undefined, false],
      vK: [undefined, 'vK'],
      vip: [undefined, true],
      karma: [undefined, 100],
    }, 'All changes there.');
  });
});

test('get object type', function(assert) {
  assert.expect(2);
  let done = assert.async();
  let syncer = this.subject(App.__container__.ownerInjection());
  syncer.set('offlineStore', App.__container__.lookup('service:store').get('offlineStore'));

  Ember.run(() => {
    syncer._getObjectType('ember-flexberry-dummy-application-user').then((newObjectType) => {
      let id = newObjectType.get('id');
      assert.equal(newObjectType.get('name'), 'ember-flexberry-dummy-application-user', `Created 'objectType' model instance.`);

      return syncer._getObjectType('ember-flexberry-dummy-application-user').then((objectType) => {
        assert.equal(objectType.get('id'), id, `Return exist 'objectType' model instance.`);
      });
    }).finally(done);
  });
});
