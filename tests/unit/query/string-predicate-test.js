import { module, test } from 'qunit';

import { StringPredicate } from 'ember-flexberry-projections/query/predicate';

module('query');

test('string predicate constructor', function (assert) {
  let p = new StringPredicate('Name');

  assert.ok(p);
  assert.ok(p.attributeName === 'Name');
});
