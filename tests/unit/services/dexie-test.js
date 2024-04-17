import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | dexie', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:dexie');
    assert.ok(service);
  });
});
