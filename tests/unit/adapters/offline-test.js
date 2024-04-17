import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | offline', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:offline');
    assert.ok(adapter);
  });
});