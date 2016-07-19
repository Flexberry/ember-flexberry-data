import Ember from 'ember';
import OfflineGlobalsInitializer from 'ember-flexberry-data/initializers/offline-globals';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | offline globals', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  OfflineGlobalsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
