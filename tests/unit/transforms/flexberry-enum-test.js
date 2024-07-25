import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { createEnum } from 'ember-flexberry-data/utils/enum-functions';

const stringEnum = createEnum({
  enumValue: 'Value for string enum property'
});

const numberEnum = createEnum({
  32: 'Value for number enum property'
});

module('transform:flexberry-enum', 'Unit | Transform | flexberry enum', function(hooks) {
  setupTest(hooks);

  test('it should throw exception if no enum property set', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    assert.throws(() => {
      new enumClass();
    });
  });

  test('it should throw exception if enum not contains value for deserialize', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(stringEnum);
    assert.throws(() => {
      transform.deserialize('notExistEnumValue');
    });
  });

  test('it should throw exception if enum not contains property to serialize', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(stringEnum);
    assert.throws(() => {
      transform.serialize('Value for string enum property that not exists');
    });
  });

  test('it should deserialize enum value for string enums', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(stringEnum);
    const deserialized = transform.deserialize('enumValue');
    assert.equal(deserialized, 'Value for string enum property');
  });

  test('it should serialize enum property for string enums', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(stringEnum);
    const serialized = transform.serialize('Value for string enum property');
    assert.equal(serialized, 'enumValue');
  });

  test('it should deserialize enum value for number enums', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(numberEnum);
    const deserialized = transform.deserialize(32);
    assert.equal(deserialized, 'Value for number enum property');
  });

  test('it should serialize enum property for number enums', function(assert) {
    const enumClass = this.owner.resolveRegistration('transform:flexberry-enum');
    const transform = new enumClass(numberEnum);
    const serialized = transform.serialize('Value for number enum property');
    assert.equal(serialized, 32);
  });
});
