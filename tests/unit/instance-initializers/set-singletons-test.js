import Application from '@ember/application';

import config from 'dummy/config/environment';
import { initialize } from 'ember-flexberry-data/instance-initializers/set-singletons';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';

module('Unit | Instance Initializer | set singletons', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.instanceInitializer({
      name: 'set-singletons',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
    });

    this.instance = this.application.buildInstance();
  });
  hooks.afterEach(function () {
    run(this.instance, 'destroy');
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await this.instance.boot();

    assert.ok(true);
  });
});
