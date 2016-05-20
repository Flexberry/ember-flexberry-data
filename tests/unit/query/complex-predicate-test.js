import { module, test } from 'qunit';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('complex predicate constructor', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');

  assert.throws(() => new ComplexPredicate('??', p1, p2), Error);
  assert.throws(() => new ComplexPredicate(Condition.Or, p1), Error);
  assert.throws(() => new ComplexPredicate(Condition.Or, 'p1', 'p2'), Error);
  assert.throws(() => new ComplexPredicate(Condition.Or, p1, 'p2'), Error);

  let p = new ComplexPredicate(Condition.Or, p1, p2);
  assert.ok(p);
  assert.ok(p.condition === Condition.Or);
  assert.ok(p.predicates);
  assert.ok(p.predicates.length === 2);
});

test('complex predicate and', function (assert) {
  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('Nationality', FilterOperator.Eq, 'Russian');
  let result = cp1.and(sp3);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.And);
  assert.ok(result.predicates.length === 2);
  assert.ok(result.predicates[0] instanceof ComplexPredicate);
  assert.ok(result.predicates[0].condition === Condition.Or);
  assert.ok(result.predicates[0].predicates.length === 2);
  assert.ok(result.predicates[1] instanceof SimplePredicate);
});

test('complex predicate and merge', function (assert) {
  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let sp3 = new SimplePredicate('Nationality', FilterOperator.Eq, 'Russian');
  let result = cp1.and(sp3);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.And);
  assert.ok(result.predicates.length === 3);
});

test('complex predicate or', function (assert) {
  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let sp3 = new SimplePredicate('Nationality', FilterOperator.Eq, 'Russian');
  let result = cp1.or(sp3);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.Or);
  assert.ok(result.predicates.length === 2);
  assert.ok(result.predicates[0] instanceof ComplexPredicate);
  assert.ok(result.predicates[0].condition === Condition.And);
  assert.ok(result.predicates[0].predicates.length === 2);
  assert.ok(result.predicates[1] instanceof SimplePredicate);
});

test('complex predicate or merge', function (assert) {
  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('Nationality', FilterOperator.Eq, 'Russian');
  let result = cp1.or(sp3);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.ok(result.condition === Condition.Or);
  assert.ok(result.predicates.length === 3);
});
