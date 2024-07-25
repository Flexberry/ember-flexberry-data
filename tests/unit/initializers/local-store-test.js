import Application from '@ember/application';

import config from 'dummy/config/environment';
import { initialize } from 'ember-flexberry-data/initializers/local-store';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';

module('Unit | Initializer | local store', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.initializer({
      name: 'local-store',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
    });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await this.application.boot();

    assert.ok(true);
  });
});