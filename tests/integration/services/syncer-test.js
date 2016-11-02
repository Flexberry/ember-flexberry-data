import Ember from 'ember';
import Dexie from 'npm:dexie';
import { moduleFor, test } from 'ember-qunit';
import { Adapter, Query, } from 'ember-flexberry-data';
import config from 'dummy/config/environment';
import startApp from 'dummy/tests/helpers/start-app';

if (config.APP.testODataService) {
  let App;
  let baseUrl;
  if (config.APP.testODataServiceURL.indexOf('http') >= 0) {
    let index = config.APP.testODataServiceURL.lastIndexOf('/');
    if (index !== config.APP.testODataServiceURL.length - 1) {
      baseUrl = config.APP.testODataServiceURL + '/';
    } else {
      baseUrl = config.APP.testODataServiceURL;
    }
  } else {
    baseUrl = 'http://rtc-web:8081/odatatmp/';
  }

  baseUrl += 'ember' + Math.floor(Math.random() * 9999);

  moduleFor('service:syncer', 'Integration | Service | syncer', {
    needs: [
      'model:ember-flexberry-dummy-application-user',
    ],

    beforeEach(assert) {
      let done = assert.async();
      Dexie.delete('TestDB').then(() => {
        App = startApp();
        App.register('adapter:application', Adapter.Odata.extend({ host: baseUrl }));
        done();
      });
    },

    afterEach() {
      Ember.run(App, 'destroy');
    },
  });

  test('create and sync without audit', function(assert) {
    runTest(App, 2, assert, (store, syncer, done) => {
      syncer.set('auditEnabled', false);
      store.get('offlineGlobals').setOnlineAvailable(false);
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        user.set('name', 'SuperMan');
        user.set('eMail', 'super.man@example.com');
        return user.save().then(() => {
          store.get('offlineGlobals').setOnlineAvailable(true);
          return syncer.syncUp().then((result) => {
            assert.equal(result, 1, 'Only one operation was executed.');
            let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
              .selectByProjection('ApplicationUserE')
              .byId(user.get('id'));
            return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
              assert.equal(onlineRecord.get('name'), 'SuperMan', 'Now SuperMan is omnipresent.');
              return new Ember.RSVP.resolve(onlineRecord);
            });
          });
        });
      }).then((user) => {
        return user.destroyRecord();
      }).finally(done);
    });
  });

  test('create and sync with audit', function(assert) {
    runTest(App, 2, assert, (store, syncer, done) => {
      store.get('offlineGlobals').setOnlineAvailable(false);
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        user.set('name', 'SuperMan');
        user.set('eMail', 'super.man@example.com');
        return user.save().then(() => {
          store.get('offlineGlobals').setOnlineAvailable(true);
          return syncer.syncUp().then((result) => {
            assert.equal(result, 2, 'Two operations were executed.');
            let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
              .selectByProjection('ApplicationUserE')
              .byId(user.get('id'));
            return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
              assert.equal(onlineRecord.get('name'), 'SuperMan', 'Now SuperMan is omnipresent.');
              return new Ember.RSVP.resolve(onlineRecord);
            });
          });
        });
      }).then((user) => {
        return user.destroyRecord();
      }).finally(done);
    });
  });

  test('update and sync without audit', function(assert) {
    runTest(App, 3, assert, (store, syncer, done) => {
      syncer.set('auditEnabled', false);
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        return syncer.syncDown(user).then(() => {
          store.get('offlineGlobals').setOnlineAvailable(false);
          let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
            .selectByProjection('ApplicationUserE')
            .byId(user.get('id'));
          return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((offlineRecord) => {
            offlineRecord.set('name', 'SuperMan');
            return offlineRecord.save().then((offlineRecord) => {
              offlineRecord.set('eMail', 'super.man@example.com');
              return offlineRecord.save().then(() => {
                store.get('offlineGlobals').setOnlineAvailable(true);
                return syncer.syncUp().then((result) => {
                  assert.equal(result, 1, 'Only one operation was executed.');
                  let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
                    .selectByProjection('ApplicationUserE')
                    .byId(user.get('id'));
                  return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
                    assert.equal(onlineRecord.get('name'), 'SuperMan', `Now he's SuperMan.`);
                    assert.equal(onlineRecord.get('eMail'), 'super.man@example.com', 'Now he has a new email address.');
                    return new Ember.RSVP.resolve(onlineRecord);
                  });
                });
              });
            });
          });
        });
      }).then((user) => {
        return user.destroyRecord();
      }).finally(done);
    });
  });

  test('update and sync with audit', function(assert) {
    runTest(App, 3, assert, (store, syncer, done) => {
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        return syncer.syncDown(user).then(() => {
          store.get('offlineGlobals').setOnlineAvailable(false);
          let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
            .selectByProjection('ApplicationUserE')
            .byId(user.get('id'));
          return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((offlineRecord) => {
            offlineRecord.set('name', 'SuperMan');
            return offlineRecord.save().then((offlineRecord) => {
              offlineRecord.set('eMail', 'super.man@example.com');
              return offlineRecord.save().then(() => {
                store.get('offlineGlobals').setOnlineAvailable(true);
                return syncer.syncUp().then((result) => {
                  assert.equal(result, 2, 'Two operations were executed.');
                  let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
                    .selectByProjection('ApplicationUserE')
                    .byId(user.get('id'));
                  return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
                    assert.equal(onlineRecord.get('name'), 'SuperMan', `Now he's SuperMan.`);
                    assert.equal(onlineRecord.get('eMail'), 'super.man@example.com', 'Now he has a new email address.');
                    return new Ember.RSVP.resolve(onlineRecord);
                  });
                });
              });
            });
          });
        });
      }).then((user) => {
        return user.destroyRecord();
      }).finally(done);
    });
  });

  test('delete and sync without audit', function(assert) {
    runTest(App, 2, assert, (store, syncer, done) => {
      syncer.set('auditEnabled', false);
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        return syncer.syncDown(user).then(() => {
          store.get('offlineGlobals').setOnlineAvailable(false);
          let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
            .selectByProjection('ApplicationUserE')
            .byId(user.get('id'));
          return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((offlineRecord) => {
            offlineRecord.set('name', 'SuperMan');
            offlineRecord.set('eMail', 'super.man@example.com');
            return offlineRecord.save().then((offlineRecord) => {
              return offlineRecord.destroyRecord().then(() => {
                store.get('offlineGlobals').setOnlineAvailable(true);
                return syncer.syncUp().then((result) => {
                  assert.equal(result, 1, 'Only one operation was executed.');
                  let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
                    .selectByProjection('ApplicationUserE')
                    .byId(user.get('id'));
                  return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
                    assert.notOk(onlineRecord, 'SuperMan is gone.');
                  });
                });
              });
            });
          });
        });
      }).finally(done);
    });
  });

  test('delete and sync with audit', function(assert) {
    runTest(App, 2, assert, (store, syncer, done) => {
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Man',
        eMail: 'man@example.com',
      }).save().then((user) => {
        return syncer.syncDown(user).then(() => {
          store.get('offlineGlobals').setOnlineAvailable(false);
          let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
            .selectByProjection('ApplicationUserE')
            .byId(user.get('id'));
          return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((offlineRecord) => {
            offlineRecord.set('name', 'SuperMan');
            offlineRecord.set('eMail', 'super.man@example.com');
            return offlineRecord.save().then((offlineRecord) => {
              return offlineRecord.destroyRecord().then(() => {
                store.get('offlineGlobals').setOnlineAvailable(true);
                return syncer.syncUp().then((result) => {
                  assert.equal(result, 2, 'Two operations were executed.');
                  let builder = new Query.Builder(store, 'ember-flexberry-dummy-application-user')
                    .selectByProjection('ApplicationUserE')
                    .byId(user.get('id'));
                  return store.queryRecord('ember-flexberry-dummy-application-user', builder.build()).then((onlineRecord) => {
                    assert.notOk(onlineRecord, 'SuperMan is gone.');
                  });
                });
              });
            });
          });
        });
      }).finally(done);
    });
  });
}

/**
  @method runTest
  @param {Application} app
  @param {Number} expect
  @param {Assert} assert
  @param {Function} test
  @private
*/
function runTest(app, expect, assert, test) {
  let store = app.__container__.lookup('service:store');
  let syncer = store.get('syncer');
  let done = assert.async();
  assert.expect(expect);
  Ember.run(null, test, store, syncer, done);
}
