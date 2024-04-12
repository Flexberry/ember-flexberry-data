import { run } from '@ember/runloop';
import Application from '@ember/application';
import LocalStoreInitializer from 'ember-flexberry-data/initializers/local-store';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | local store', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  test('it works', function(assert) {
    LocalStoreInitializer.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});