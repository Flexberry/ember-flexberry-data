import { module, test } from 'qunit';

import { StringPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | string | constructor', function (assert) {
  assert.throws(() => new StringPredicate(), Error);
  assert.throws(() => new StringPredicate(''), Error);
  assert.throws(() => new StringPredicate(null), Error);

  let p = new StringPredicate('Name');

  assert.ok(p);
  assert.equal(p.attributeName, 'Name');
});
