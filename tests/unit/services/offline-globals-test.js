import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';

import startApp from '../../helpers/start-app';

let App;

moduleFor('service:offline-globals', 'Unit | Service | offline globals', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']

  beforeEach() {
    App = startApp();
  },

  afterEach() {
    run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject(App.__container__.ownerInjection());
  assert.ok(service);
});
