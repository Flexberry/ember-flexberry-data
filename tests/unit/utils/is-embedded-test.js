import { run } from '@ember/runloop';
import DS from 'ember-data';
import { module, test } from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import isEmbedded from 'ember-flexberry-data/utils/is-embedded';

let App;
const model = DS.Model.extend({
  attribute: DS.attr('string'),
});
const serializer = DS.Serializer.extend({
  attrs: {
    attribute: { serialize: false },
    relationship: { embedded: 'always' },
    relationships: { deserialize: 'records' },
  },
});

module('Unit | Utility | is embedded', function(hooks) {
  hooks.beforeEach(function() {
    App = startApp();
    App.register('model:model', model);
    App.register('serializer:model', serializer);
  });

  hooks.afterEach(function() {
    run(App, 'destroy');
  });

  test('isEmbedded is working', function(assert) {
    let store = App.__container__.lookup('service:store');
    assert.notOk(isEmbedded(store, store.modelFor('model'), 'attribute'));
    assert.ok(isEmbedded(store, store.modelFor('model'), 'relationship'));
    assert.ok(isEmbedded(store, store.modelFor('model'), 'relationships'));
  });
});
