import { module, test } from 'qunit';
import FilterOperator from 'ember-flexberry-projections/query-filter-operator';
import Condition from 'ember-flexberry-projections/query-condition';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-projections/query-predicate';

module('query');

test('simple predicate constructor', function (assert) {
  let p = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');

  assert.ok(p);
  assert.ok(p.property === 'Name');
  assert.ok(p.operator === FilterOperator.Eq);
  assert.ok(p.value === 'Vasya');
});

test('simple predicate or', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let result = p1.or(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.Or);
  assert.ok(result.predicates.length === 2);
});

test('simple predicate and', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let result = p1.and(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.And);
  assert.ok(result.predicates.length === 2);
});
