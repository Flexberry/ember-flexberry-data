import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import { Offline, Serializer } from 'ember-flexberry-data';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleForModel('audit-entity', 'Unit | Serializer | audit-entity-offline', {
  needs: [
    'serializer:audit-entity-offline',
    'model:audit-field',
  ],

  beforeEach() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', Offline.Store);
    App.register('store:local', Offline.LocalStore);
  },

  afterEach() {
    Ember.run(App, 'destroy');
  },
});

test('this is a sure serializer', function(assert) {
  let record = this.subject(App.__container__.ownerInjection());
  let store = App.resolveRegistration('service:store').create(App.__container__.ownerInjection());
  let onlineSerializer = store.serializerFor(record._createSnapshot().modelName, true);
  let offlineSerializer = store.serializerFor(record._createSnapshot().modelName, false);
  assert.ok(onlineSerializer instanceof Serializer.Odata);
  assert.ok(offlineSerializer instanceof Serializer.Offline);
});
