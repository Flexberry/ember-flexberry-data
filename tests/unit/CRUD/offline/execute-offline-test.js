import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import destroyApp from '../../../helpers/destroy-app';

var App;
var store;

export default function executeTest(testName, callback) {
  module('CRUD | offline-' + testName, {
    setup: function() {
      App = startApp();
      store = App.__container__.lookup('service:store');
      let dbName = 'testDB' + Math.floor(Math.random() * 9999);

      // Override store.unloadAll method.
      const originalUnloadAll = store.unloadAll;
      store.unloadAll = function() {
        originalUnloadAll.apply(store, arguments);

        // Clean up type maps otherwise internal models won't be cleaned from stores,
        // and it will cause some exceptions related to store's internal-models statuses.
        Ember.A([store, store.get('onlineStore'), store.get('offlineStore')]).forEach((s) => {
          Ember.set(s, 'typeMaps', {});
        });
      };

      let offlineSchema = {};
      offlineSchema[dbName] = {
        1: store.get('offlineSchema.TestDB')['0.1'],
      };
      store.set('offlineSchema', offlineSchema);
      store.set('offlineStore.dbName', dbName);
      let offlineGlobals = App.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
    },
    teardown: function(assert) {
      let cleanUpDone = assert.async();

      Ember.run(() => {
        store.adapterFor('application').delete().then(() => {
          destroyApp(App);

          cleanUpDone();
        });
      });
    }
  });

  test(testName, (assert) => callback(store, assert));
}
