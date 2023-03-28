import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:decimal', 'Unit | Transform | decimal');

test('serialize', function(assert) {
  let transform = this.subject();

  assert.strictEqual(transform.serialize(555.5), 555.5);
  assert.strictEqual(transform.serialize('555.5'), 555.5);
  assert.strictEqual(transform.serialize('555,5'), 555.5);
});

test('deserialize', function(assert) {
  let transform = this.subject();

  assert.strictEqual(transform.deserialize(555.5), 555.5);
  assert.strictEqual(transform.deserialize('555.5'), 555.5);
  assert.strictEqual(transform.deserialize('555,5'), 555.5);
});
