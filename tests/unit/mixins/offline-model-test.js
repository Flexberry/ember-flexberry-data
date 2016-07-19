import Ember from 'ember';
import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';
import { module, test } from 'qunit';

import startApp from '../../helpers/start-app';

let App;

module('Unit | Mixin | offline model', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let OfflineModelObject = Ember.Object.extend(App.__container__.ownerInjection(), OfflineModelMixin);
  let subject = OfflineModelObject.create();
  assert.ok(subject);
});
