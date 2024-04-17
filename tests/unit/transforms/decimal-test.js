import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | decimal', function(hooks) {
  setupTest(hooks);

  test('serialize', function(assert) {
    let transform = this.owner.lookup('transform:decimal');
    assert.strictEqual(transform.serialize(555.5), 555.5);
    assert.strictEqual(transform.serialize('555.5'), 555.5);
    assert.strictEqual(transform.serialize('555,5'), 555.5);
  });

  test('deserialize', function(assert) {
    let transform = this.owner.lookup('transform:decimal');
    assert.strictEqual(transform.deserialize(555.5), 555.5);
    assert.strictEqual(transform.deserialize('555.5'), 555.5);
    assert.strictEqual(transform.deserialize('555,5'), 555.5);
  });
});
