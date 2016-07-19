import Ember from 'ember';
import AdapterMixin from 'ember-flexberry-data/mixins/adapter';
import { module, test } from 'qunit';

import startApp from '../../helpers/start-app';

let App;

module('Unit | Mixin | adapter', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let AdapterObject = Ember.Object.extend(App.__container__.ownerInjection(), AdapterMixin);
  let subject = AdapterObject.create();
  assert.ok(subject);
});
