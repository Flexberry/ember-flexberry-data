import { run } from '@ember/runloop';
import Application from '@ember/application';
import OfflineGlobalsInitializer from 'ember-flexberry-data/initializers/offline-globals';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | offline globals', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  test('it works', function(assert) {
    OfflineGlobalsInitializer.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});