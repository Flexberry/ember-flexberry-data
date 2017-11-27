import { module, test } from 'qunit';

import { NotPredicate } from 'ember-flexberry-data/query/predicate';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

module('query');

test('not-predicate | string | constructor', function (assert) {
  let innerPredicate = new SimplePredicate('address', FilterOperator.Eq, 'Street, 200');

  assert.throws(() => new NotPredicate(), Error);
  assert.throws(() => new NotPredicate(''), Error);
  assert.throws(() => new NotPredicate(null), Error);

  let p = new NotPredicate(innerPredicate);

  assert.ok(p);
  assert.equal(p.toString(), 'not (address eq Street, 200)');
});
