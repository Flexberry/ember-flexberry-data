import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../../../helpers/start-app';
import destroyApp from '../../../helpers/destroy-app';

export default function executeTest(testName, callback, skipTest) {
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
        2: storeExecuteOfflineTest.get('offlineSchema.TestDB')['0.2'],
      };
      storeExecuteOfflineTest.set('offlineSchema', offlineSchema);
      storeExecuteOfflineTest.set('offlineStore.dbName', dbName);
      let offlineGlobals = AppExecuteOfflineTest.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
      storeExecuteOfflineTest._dbInit();
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

  (skipTest ? skip : test)(testName, (assert) => callback(storeExecuteOfflineTest, assert, AppExecuteOfflineTest));
}
