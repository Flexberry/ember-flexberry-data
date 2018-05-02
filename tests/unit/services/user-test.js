import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import BaseStore from 'ember-flexberry-data/stores/base-store';
import LocalStore from 'ember-flexberry-data/stores/local-store';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleFor('service:user', 'Unit | Service | user', {
  needs: [
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],

  beforeEach() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', BaseStore);
    App.register('store:local', LocalStore);
  },

  afterEach() {
    run(App, 'destroy');
  },
});

test('it works', function(assert) {
  // TODO: Replace this with your real tests.
  let service = this.subject(App.__container__.ownerInjection());
  assert.ok(!!service);
});
