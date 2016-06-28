import { module, test } from 'qunit';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { DetailPredicate, SimplePredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | detail | constructor', function (assert) {
  assert.throws(() => new DetailPredicate(), Error);
  assert.throws(() => new DetailPredicate(''), Error);
  assert.throws(() => new DetailPredicate(null), Error);

  let p = new DetailPredicate('DetailName');

  assert.ok(p);
  assert.equal(p.detailPath, 'DetailName');
  assert.notOk(p.predicate);
  assert.notOk(p.isAll);
  assert.notOk(p.isAny);
});

test('predicate | detail | all | throws', function (assert) {
  assert.throws(() => new DetailPredicate('DetailName').all(), Error);
  assert.throws(() => new DetailPredicate('DetailName').all(null), Error);
});

test('predicate | detail | all | with predicate', function (assert) {
  let sp = new SimplePredicate('Field', FilterOperator.Eq, 'Value');
  let p = new DetailPredicate('DetailName').all(sp);

  assert.ok(p);
  assert.equal(p.predicate, sp);
  assert.ok(p.isAll);
  assert.notOk(p.isAny);
});

test('predicate | detail | all | with arguments', function (assert) {
  let p = new DetailPredicate('DetailName').all('Field', FilterOperator.Eq, 'Value');

  assert.ok(p);
  assert.ok(p.predicate instanceof SimplePredicate);
  assert.ok(p.predicate.attributePath, 'Field');
  assert.ok(p.predicate.operator, FilterOperator.Eq);
  assert.ok(p.predicate.value, 'Value');
  assert.ok(p.isAll);
  assert.notOk(p.isAny);
});

test('predicate | detail | any | throws', function (assert) {
  assert.throws(() => new DetailPredicate('DetailName').any(), Error);
  assert.throws(() => new DetailPredicate('DetailName').any(null), Error);
});

test('predicate | detail | any | with predicate', function (assert) {
  let sp = new SimplePredicate('Field', FilterOperator.Eq, 'Value');
  let p = new DetailPredicate('DetailName').any(sp);

  assert.ok(p);
  assert.equal(p.predicate, sp);
  assert.ok(p.isAny);
  assert.notOk(p.isAll);
});

test('predicate | detail | any | with arguments', function (assert) {
  let p = new DetailPredicate('DetailName').any('Field', FilterOperator.Eq, 'Value');

  assert.ok(p);
  assert.ok(p.predicate instanceof SimplePredicate);
  assert.ok(p.predicate.attributePath, 'Field');
  assert.ok(p.predicate.operator, FilterOperator.Eq);
  assert.ok(p.predicate.value, 'Value');
  assert.ok(p.isAny);
  assert.notOk(p.isAll);
});
