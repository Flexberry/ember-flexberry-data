import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';
import { Offline, Serializer } from 'ember-flexberry-data';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', 'Unit | Serializer | object-type-offline', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline',
  ],

  beforeEach() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', Offline.Store);
    App.register('store:local', Offline.LocalStore);
  },

  afterEach() {
    run(App, 'destroy');
  },
});

test('it serializes records', function(assert) {
  let record = this.subject(App.__container__.ownerInjection());
  let store = App.resolveRegistration('service:store').create(App.__container__.ownerInjection());
  let onlineSerializer = store.serializerFor(record._createSnapshot().modelName, true);
  let offlineSerializer = store.serializerFor(record._createSnapshot().modelName, false);
  assert.ok(onlineSerializer instanceof Serializer.Odata);
  assert.ok(offlineSerializer instanceof Serializer.Offline);
});
