import { module, test } from 'qunit';
import isUUID from 'ember-flexberry-data/utils/is-uuid';

module('Unit | Utility | is uuid');

test('it really works', function(assert) {
  let string = 'string';
  let numer = 5;
  let guid = '1f2d836d-bb9f-4371-b9c0-e2a084a07bf4';

  assert.notOk(isUUID(string));
  assert.notOk(isUUID(numer));
  assert.ok(isUUID(guid));
});
