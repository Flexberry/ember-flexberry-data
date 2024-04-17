import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import BaseStore from 'ember-flexberry-data/stores/base-store';
import LocalStore from 'ember-flexberry-data/stores/local-store';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';
import OdataSerializer from 'ember-flexberry-data/serializers/odata';
import startApp from 'dummy/tests/helpers/start-app';

let App;

module('Unit | Serializer | object-type-offline', function(hooks) {
  hooks.beforeEach(function() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', BaseStore);
    App.register('store:local', LocalStore);
  });

  hooks.afterEach(function() {
    run(App, 'destroy');
  });

  test('this is a correct serializer', function(assert) {
    run(() => {
      let store = App.resolveRegistration('service:store').create(App.__container__.ownerInjection());
      let record = store.createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type');
      let onlineSerializer = store.serializerFor(record._createSnapshot().modelName, true);
      let offlineSerializer = store.serializerFor(record._createSnapshot().modelName, false);
      assert.ok(onlineSerializer instanceof OdataSerializer);
      assert.ok(offlineSerializer instanceof OfflineSerializer);
    });
  });
});
