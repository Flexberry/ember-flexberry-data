import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import destroyApp from '../../../helpers/destroy-app';

export default function executeTest(testName, callback) {
  let AppExecuteOfflineTest;
  let storeExecuteOfflineTest;
  let testDbName;
  module('CRUD | offline-' + testName, {
    setup: function() {
      AppExecuteOfflineTest = startApp();
      storeExecuteOfflineTest = AppExecuteOfflineTest.__container__.lookup('service:store');
      let dbName = 'testDbEOT' + Math.floor(Math.random() * 9999);
      testDbName = dbName;

      let offlineSchema = {};
      offlineSchema[dbName] = {
        1: storeExecuteOfflineTest.get('offlineSchema.TestDB')['0.1'],
      };
      storeExecuteOfflineTest.set('offlineSchema', offlineSchema);
      storeExecuteOfflineTest.set('offlineStore.dbName', dbName);
      let offlineGlobals = AppExecuteOfflineTest.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
    },
    teardown: function(assert) {
      let cleanUpDone = assert.async();

      Ember.run(() => {
        let dexieService = AppExecuteOfflineTest.__container__.lookup('service:dexie');
        dexieService.close(testDbName);
        storeExecuteOfflineTest.adapterFor('application').delete().then(() => {
          destroyApp(AppExecuteOfflineTest);

          cleanUpDone();
        });
      });
    }
  });

  test(testName, (assert) => callback(storeExecuteOfflineTest, assert, AppExecuteOfflineTest));
}
