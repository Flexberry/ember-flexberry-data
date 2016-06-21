import { module, test } from 'qunit';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | simple | constructor', function (assert) {
  let p = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');

  assert.ok(p);
  assert.equal(p.attributeName, 'Name');
  assert.equal(p.operator, FilterOperator.Eq);
  assert.equal(p.value, 'Vasya');
});

test('predicate | simple | or', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let result = p1.or(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.Or);
  assert.equal(result.predicates.length, 2);
});

test('predicate | simple | and', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let result = p1.and(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.And);
  assert.equal(result.predicates.length, 2);
});
