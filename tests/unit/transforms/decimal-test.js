import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:decimal', 'Unit | Transform | decimal', {
});

test('decimal | deserialize | number', function (assert) {
  let transform = this.subject();
  let deserialized = transform.deserialize(555.5);
  assert.equal(deserialized, 555.5);
});

test('decimal | deserialize | string with \'.\'', function (assert) {
  let transform = this.subject();
  let deserialized = transform.deserialize('555.5');
  assert.equal(deserialized, 555.5);
});

test('decimal | deserialize | string with \',\'', function (assert) {
  let transform = this.subject();
  let deserialized = transform.deserialize('555,5');
  assert.equal(deserialized, 555.5);
});

test('decimal | serialize | number', function (assert) {
  let transform = this.subject();
  let serialized = transform.serialize(555.5);
  assert.equal(serialized, 555.5);
});

test('decimal | serialize | string with \'.\'', function (assert) {
  let transform = this.subject();
  let serialized = transform.serialize('555.5');
  assert.equal(serialized, 555.5);
});

test('decimal | serialize | string with \',\'', function (assert) {
  let transform = this.subject();
  let serialized = transform.serialize('555,5');
  assert.equal(serialized, 555.5);
});
