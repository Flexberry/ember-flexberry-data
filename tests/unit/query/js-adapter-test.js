import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-projections/query/builder';
import JSAdapter from 'ember-flexberry-projections/query/js-adapter';
import FilterOperator from 'ember-flexberry-projections/query/filter-operator';
import Condition from 'ember-flexberry-projections/query/condition';
import { SimplePredicate, ComplexPredicate, StringPredicate } from 'ember-flexberry-projections/query/predicate';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');

module('query');

test('adapter js without predicate', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(3, result.length);
});

test('adapter js simple predicate eq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Eq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('Y', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js simple predicate neq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Neq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js simple predicate le', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Le, 12);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Y', result[1].Surname);
});

test('adapter js simple predicate leq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Leq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Y', result[1].Surname);
});

test('adapter js simple predicate ge', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Ge, 10);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('Y', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js simple predicate geq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let adapter = new JSAdapter();
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Geq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('Y', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js string predicate contains', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10, Country: 'Argentina' },
    { Name: 'B', Surname: 'Y', Age: 11, Country: 'Paragwaj' },
    { Name: 'C', Surname: 'Z', Age: 12, Country: 'Russia' }
  ];

  let sp1 = new StringPredicate('Country').contains('i');
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(sp1);
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js complex predicate and', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 10 },
    { Name: 'B', Surname: 'Z', Age: 11 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(cp1);
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Y', result[1].Surname);
});

test('adapter js complex predicate or', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(cp1);
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(2, result.length);
  assert.equal('X', result[0].Surname);
  assert.equal('Z', result[1].Surname);
});

test('adapter js select', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').select('Age,Name');
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(3, result.length);
  assert.ok(result[0].Name);
  assert.ok(result[0].Age);
  assert.notOk(result[0].Surname);
});

test('adapter js order', (assert) => {
  const data = [
    { Name: 'A', Price: 200, Age: 10 },
    { Name: 'B', Price: 100, Age: 10 },
    { Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').orderBy('Age desc, Price asc');
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(3, result.length);
  assert.equal('C', result[0].Name);
  assert.equal('B', result[1].Name);
  assert.equal('A', result[2].Name);
});

test('adapter js skip-top', (assert) => {
  const data = [
    { Name: 'A', Price: 200, Age: 10 },
    { Name: 'B', Price: 100, Age: 10 },
    { Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').skip(1).top(1);
  let adapter = new JSAdapter();
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(1, result.length);
  assert.equal('B', result[0].Name);
});
