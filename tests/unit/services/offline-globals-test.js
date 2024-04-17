import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | offline-globals', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:offline-globals');
    assert.ok(service);
  });
});
