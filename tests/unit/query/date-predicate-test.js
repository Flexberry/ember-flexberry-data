import { module, test } from 'qunit';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { DatePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | date | constructor', function (assert) {
  let now = Date();

  let p1 = new DatePredicate('StartDate', FilterOperator.Eq, now);
  let p2 = new DatePredicate('EndDate', FilterOperator.Eq, now, true);

  assert.ok(p1);
  assert.equal(p1.attributePath, 'StartDate');
  assert.equal(p1.operator, FilterOperator.Eq);
  assert.equal(p1.value, now);
  assert.equal(!!p1.timeless, false);

  assert.ok(p2);
  assert.equal(p2.timeless, true);
});

test('predicate | date | or', function (assert) {
  let now = Date();

  let p1 = new DatePredicate('StartDate', FilterOperator.Eq, now);
  let p2 = new DatePredicate('EndDate', FilterOperator.Eq, now, true);
  let result = p1.or(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.Or);
  assert.equal(result.predicates.length, 2);
});

test('predicate | date | and', function (assert) {
  let now = Date();

  let p1 = new DatePredicate('StartDate', FilterOperator.Eq, now);
  let p2 = new DatePredicate('EndDate', FilterOperator.Eq, now, true);
  let result = p1.and(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.And);
  assert.equal(result.predicates.length, 2);
});
