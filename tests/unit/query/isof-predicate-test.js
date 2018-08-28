import { module, test } from 'qunit';

import { IsOfPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | isof | constructor', function (assert) {
  assert.throws(() => new IsOfPredicate());
  assert.throws(() => new IsOfPredicate(null));
  assert.throws(() => new IsOfPredicate(null, null));

  let p1 = new IsOfPredicate('Manager', 'employee');
  let p2 = new IsOfPredicate('employee');

  assert.ok(p1);
  assert.equal(p1.expression, 'Manager');
  assert.equal(p1.typeName, 'employee');
  assert.ok(p2);
  assert.notOk(p2.expression);
  assert.equal(p2.typeName, 'employee');
});
