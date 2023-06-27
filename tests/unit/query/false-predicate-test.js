import { module, test } from 'qunit';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, FalsePredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | false | constructor', function (assert) {
  let p = new FalsePredicate();

  assert.ok(p);
});

test('predicate | false | simple | or', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let fp = new FalsePredicate();

  let result = fp.or(p1).or(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.Or);
  assert.equal(result.predicates.length, 3);
});

test('predicate | false | simple | and', function (assert) {
  let p1 = new SimplePredicate('Name', FilterOperator.Eq, 'Vasya');
  let p2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Ivanov');
  let fp = new FalsePredicate();

  let result = fp.and(p1).and(p2);

  assert.ok(result);
  assert.ok(result instanceof ComplexPredicate);
  assert.equal(result.condition, Condition.And);
  assert.equal(result.predicates.length, 3);
});
