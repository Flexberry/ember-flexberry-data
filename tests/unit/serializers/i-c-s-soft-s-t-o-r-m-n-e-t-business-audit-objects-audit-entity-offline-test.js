import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';
import BaseStore from 'ember-flexberry-data/stores/base-store';
import LocalStore from 'ember-flexberry-data/stores/local-store';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';
import OdataSerializer from 'ember-flexberry-data/serializers/odata';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', 'Unit | Serializer | audit-entity-offline', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline',
    'transform:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant',
    'transform:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],

  beforeEach() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', BaseStore);
    App.register('store:local', LocalStore);
  },

  afterEach() {
    run(App, 'destroy');
  },
});

test('this is a sure serializer', function(assert) {
  let record = this.subject(App.__container__.ownerInjection());
  let store = App.resolveRegistration('service:store').create(App.__container__.ownerInjection());
  let onlineSerializer = store.serializerFor(record._createSnapshot().modelName, true);
  let offlineSerializer = store.serializerFor(record._createSnapshot().modelName, false);
  assert.ok(onlineSerializer instanceof OdataSerializer);
  assert.ok(offlineSerializer instanceof OfflineSerializer);
});
