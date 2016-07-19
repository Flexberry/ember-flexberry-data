import Ember from 'ember';
import StoreMixin from 'ember-flexberry-data/mixins/store';
import { module, test } from 'qunit';

import startApp from '../../helpers/start-app';

let App;

module('Unit | Mixin | store', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let StoreObject = Ember.Object.extend(App.__container__.ownerInjection(), StoreMixin);
  let subject = StoreObject.create();
  assert.ok(subject);
});
