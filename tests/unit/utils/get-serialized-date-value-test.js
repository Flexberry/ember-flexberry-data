import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import getSerializedDateValue from 'ember-flexberry-data/utils/get-serialized-date-value';

module('Unit | Utility | get serialized date value', function(hooks) {
  setupTest(hooks);

  test('it works', function(assert) {
    let store = this.owner.lookup('service:store');
    let dateTransform = this.owner.resolveRegistration('transform:date').create();
    let date = new Date(1981, 10, 12, 13, 14, 15);
    let expectedResult = dateTransform.serialize(date);
    let result = getSerializedDateValue.call(store, date);
    assert.ok(result);
    assert.equal(result, expectedResult);
  });
});
