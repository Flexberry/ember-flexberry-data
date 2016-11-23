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

  test(testName, (assert) => callback(store, assert, App));
}
