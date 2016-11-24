import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';
import Dexie from 'npm:dexie';
import { Query } from 'ember-flexberry-data';

var AppOfflineCrudTest;
var storeOfflineCrudTest;
var run = Ember.run;
var get = Ember.get;
const dbNameOfflineCrudTest = 'TestDbOCT';

module('offline-CRUD', {
  beforeEach: function (assert) {
    var done = assert.async();
    run(function () {
      AppOfflineCrudTest = startApp();
      storeOfflineCrudTest = AppOfflineCrudTest.__container__.lookup('service:store');
      let offlineSchema = {};
      offlineSchema[dbNameOfflineCrudTest] = {
        1: storeOfflineCrudTest.get('offlineSchema.TestDB')['0.1'],
      };
      storeOfflineCrudTest.set('offlineSchema', offlineSchema);
      storeOfflineCrudTest.set('offlineStore.dbName', dbNameOfflineCrudTest);
      let offlineGlobals = AppOfflineCrudTest.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);

      let dexieService = AppOfflineCrudTest.__container__.lookup('service:dexie');
      var db = dexieService.dexie(dbNameOfflineCrudTest, storeOfflineCrudTest);
      Dexie.delete(dbNameOfflineCrudTest).then(() => {
        db.open().then((db) => {
          let promises = [];
          promises.push(db.table('ember-flexberry-dummy-suggestion').put({
            id: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
            address: 'Street, 20',
            text: 'Loooong text',
            date: new Date(2016, 5, 13),
            votes: 1,
            moderated: false,
            type: 'de627522-47c3-428f-99be-fdac2e8f5618',
            author: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
            editor1: null,
            files: [],
            userVotes: ['8be0d89b-8cab-4b0b-b029-356c59809163'],
            comments: ['7e5d3b63-eb5e-446e-84da-26865f87c1c5']
          }));
          promises.push(db.table('ember-flexberry-dummy-suggestion-type').bulkPut([
            {
              id: 'de627522-47c3-428f-99be-fdac2e8f5618',
              name: '123',
              moderated: false,
              parent: 'afe58e47-b3aa-474d-b475-427ff5394c44',
              localizedTypes: []
            },
            {
              id: 'afe58e47-b3aa-474d-b475-427ff5394c44',
              name: 'Type #8',
              moderated: false,
              parent: null,
              localizedTypes: []
            }
          ]));
          promises.push(db.table('ember-flexberry-dummy-application-user').put({
            id: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
            name: 'Васиииилий',
            eMail: 'pupkin1@mail.ru',
            phone1: '+790356568933',
            phone2: '',
            phone3: '+790356568935',
            activated: true,
            vK: '',
            facebook: '',
            twitter: '',
            birthday: new Date(1997, 5, 11),
            gender: 'Male',
            vip: true,
            karma: 11.4
          }));
          promises.push(db.table('ember-flexberry-dummy-vote').put({
            id: '8be0d89b-8cab-4b0b-b029-356c59809163',
            suggestion: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
            voteType: 'Like',
            applicationUser: '555a6d25-ac76-417c-bcc5-25bc260fc3ae'
          }));
          promises.push(db.table('ember-flexberry-dummy-comment').put({
            id: '7e5d3b63-eb5e-446e-84da-26865f87c1c5',
            suggestion: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
            text: 'Not ok',
            votes: 566,
            moderated: false,
            author: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
            userVotes: ['721e65db-9e04-47a3-8f29-3b5c39fff8dd']
          }));
          promises.push(db.table('ember-flexberry-dummy-comment-vote').put({
            id: '721e65db-9e04-47a3-8f29-3b5c39fff8dd',
            comment: '7e5d3b63-eb5e-446e-84da-26865f87c1c5',
            voteType: 'Dislike',
            applicationUser: '555a6d25-ac76-417c-bcc5-25bc260fc3ae'
          }));
          return new Dexie.Promise.all(promises).then(() => {
            db.close();
            return Dexie.Promise.resolve();
          });
        }).finally(done);
      }).catch(done);
    });
  },

  afterEach: function () {
    run(function () {
      destroyApp(AppOfflineCrudTest);
    });
  }
});

test('find record', function (assert) {
  assert.expect(13);
  var done1 = assert.async();
  run(function () {
    storeOfflineCrudTest.findRecord('ember-flexberry-dummy-suggestion', 'fea5b275-cb9b-4584-ba04-26122bc8cbd3').then(function(records) {
      assert.equal(get(records, 'address'), 'Street, 20', 'record address = Street, 20');
      assert.equal(get(records, 'text'), 'Loooong text', 'record text = Loooong text');
      assert.equal(get(records, 'votes'), 1, 'record votes = 1');
      assert.equal(get(records, 'moderated'), false, '1 record was found');
      done1();
    });
  });
  var done2 = assert.async();
  run(function () {
    storeOfflineCrudTest.findRecord('ember-flexberry-dummy-suggestion-type', 'de627522-47c3-428f-99be-fdac2e8f5618').then(function(records) {
      assert.equal(get(records, 'name'), '123', '1 record was found');
      assert.equal(get(records, 'moderated'), false, '1 record was found');
      done2();
    });
  });
  var done3 = assert.async();
  run(function () {
    storeOfflineCrudTest.findRecord('ember-flexberry-dummy-application-user', '555a6d25-ac76-417c-bcc5-25bc260fc3ae').then(function(records) {
      assert.equal(get(records, 'name'), 'Васиииилий', '1 record was found');
      assert.equal(get(records, 'eMail'), 'pupkin1@mail.ru', '1 record was found');
      assert.equal(get(records, 'activated'), true, '1 record was found');
      done3();
    });
  });
  var done4 = assert.async();
  run(function () {
    storeOfflineCrudTest.findRecord('ember-flexberry-dummy-vote', '8be0d89b-8cab-4b0b-b029-356c59809163').then(function(records) {
      assert.equal(get(records, 'voteType'), 'Like', '1 record was found');
      done4();
    });
  });
  var done5 = assert.async();
  run(function () {
    storeOfflineCrudTest.findRecord('ember-flexberry-dummy-comment', '7e5d3b63-eb5e-446e-84da-26865f87c1c5').then(function(records) {
      assert.equal(get(records, 'text'), 'Not ok', '1 record was found');
      assert.equal(get(records, 'votes'), 566, '1 record was found');
      assert.equal(get(records, 'moderated'), false, '1 record was found');
      done5();
    });
  });
});

test('find all records', function (assert) {
  assert.expect(1);
  var done = assert.async();
  run(function () {
    storeOfflineCrudTest.findAll('ember-flexberry-dummy-suggestion').then(function(records) {
      var firstRecord = records.objectAt(0);
      assert.equal(get(firstRecord, 'address'), 'Street, 20', '1 record was found');
      done();
    });
  });
});

test('query record via query', function (assert) {
  assert.expect(2);
  var done1 = assert.async();
  run(function () {
    storeOfflineCrudTest.query('ember-flexberry-dummy-suggestion', { address: 'Street, 20' }).then(function(records) {
      var firstRecord = records.objectAt(0);
      assert.equal(get(firstRecord, 'address'), 'Street, 20', '1 record was found without query language');
      done1();
    });
  });

  var done2 = assert.async();
  run(function () {
    let modelName = 'ember-flexberry-dummy-suggestion';
    let builder = new Query.Builder(storeOfflineCrudTest, modelName).selectByProjection('SuggestionL').where('address', Query.FilterOperator.Eq, 'Street, 20');
    storeOfflineCrudTest.query(modelName, builder.build()).then(function(records) {
      var firstRecord = records.objectAt(0);
      assert.equal(get(firstRecord, 'address'), 'Street, 20', '1 record was found with query language');
      done2();
    });
  });
});

test('query record via queryRecord', function (assert) {
  assert.expect(2);
  var done1 = assert.async();
  run(function () {
    storeOfflineCrudTest.queryRecord('ember-flexberry-dummy-suggestion', { address: 'Street, 20' }).then(function(record) {
      assert.equal(get(record, 'address'), 'Street, 20', '1 record was found without query language');
      done1();
    });
  });

  var done2 = assert.async();
  run(function () {
    let modelName = 'ember-flexberry-dummy-suggestion';
    let builder = new Query.Builder(storeOfflineCrudTest, modelName).selectByProjection('SuggestionL').where('address', Query.FilterOperator.Eq, 'Street, 20');
    storeOfflineCrudTest.queryRecord(modelName, builder.build()).then(function(record) {
      assert.equal(get(record, 'address'), 'Street, 20', '1 record was found with query language');
      done2();
    });
  });
});

test('create record', function(assert) {
  assert.expect(3);
  let done = assert.async();

  run(function() {
    var list = storeOfflineCrudTest.createRecord('ember-flexberry-dummy-application-user', {
      name: 'чел',
      eMail: 'pupkin1@mail.ru',
      phone1: '+790356568933',
      phone2: '',
      phone3: '+790356568935',
      activated: true,
      vK: '',
      facebook: '',
      twitter: '',
      birthday: new Date(1997, 5, 11),
      gender: 'Male',
      vip: true,
      karma: 11.4
    });

    list.save().then(function() {
      return storeOfflineCrudTest.query('ember-flexberry-dummy-application-user', {
        name: 'чел'
      });
    }).then(function(records) {
      var record = records.objectAt(0);
      assert.equal(get(records, 'length'), 1, 'Only чел was found');
      assert.equal(get(record, 'name'), 'чел', 'Correct name');
      assert.equal(get(record, 'id'), list.id, 'Correct, original id');
      done();
    });
  });
});

test('delete record', function(assert) {
  assert.expect(2);
  let done = assert.async();

  run(function() {
    var AssertListIsDeleted = function() {
      return storeOfflineCrudTest.query('ember-flexberry-dummy-application-user', {
        name: 'Васиииилий'
      }).then(function(records) {
        assert.equal(get(records, 'length'), 0, 'No record was found');
        done();
      });
    };

    storeOfflineCrudTest.query('ember-flexberry-dummy-application-user', {
      name: 'Васиииилий'
    }).then(function(records) {
      var record = records.objectAt(0);
      assert.equal(get(record, 'id'), '555a6d25-ac76-417c-bcc5-25bc260fc3ae', 'Item exists');
      record.destroyRecord().then(AssertListIsDeleted);
    });
  });
});
