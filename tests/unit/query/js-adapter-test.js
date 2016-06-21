import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import JSAdapter from 'ember-flexberry-data/query/js-adapter';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from 'ember-flexberry-data/query/predicate';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');
const adapter = new JSAdapter();

module('query');

test('adapter | js | without predicate', (assert) => {
  const data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'A', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].Id, 1);
  assert.equal(result[1].Id, 2);
  assert.equal(result[2].Id, 3);
});

test('adapter | js | simple predicate | eq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Eq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | neq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Neq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | le', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Le, 12);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Y');
});

test('adapter | js | simple predicate | leq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Leq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Y');
});

test('adapter | js | simple predicate | ge', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Ge, 10);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | geq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Age', FilterOperator.Geq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | string predicate | contains', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10, Country: 'Argentina' },
    { Name: 'B', Surname: 'Y', Age: 11, Country: 'Paragwaj' },
    { Name: 'C', Surname: 'Z', Age: 12, Country: 'Russia' }
  ];

  let sp1 = new StringPredicate('Country').contains('i');
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(sp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | detail predicate | all | with simple predicate', (assert) => {
  const data = [
    { Id: 1, Tags: [{ Name: 'Tag1' }] },
    { Id: 2 },
    { Id: 3 }
  ];

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Id, 1);
});

test('adapter | js | detail predicate | any | with simple predicate', (assert) => {
  const data = [
    { Id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { Id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { Id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Id, 1);
  assert.equal(result[1].Id, 3);
});

test('adapter | js | detail predicate | all | with complex predicate', (assert) => {
  const data = [
    { Id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { Id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { Id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag3');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Id, 1);
});

test('adapter | js | detail predicate | any | with complex predicate', (assert) => {
  const data = [
    { Id: 1, Tags: [{ Name: 'Tag4' }, { Name: 'Tag3' }] },
    { Id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag1' }] },
    { Id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag0' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag2');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Id, 2);
  assert.equal(result[1].Id, 3);
});

test('adapter | js | complex predicate | and', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 10 },
    { Name: 'B', Surname: 'Z', Age: 11 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(cp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Y');
});

test('adapter | js | complex predicate | or', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let builder = new QueryBuilder(store, 'AnyUnknownModel').where(cp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | select', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').select('Age,Name');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.ok(result[0].Name);
  assert.ok(result[0].Age);
  assert.notOk(result[0].Surname);
});

test('adapter | js | order', (assert) => {
  const data = [
    { Name: 'A', Price: 200, Age: 10 },
    { Name: 'B', Price: 100, Age: 10 },
    { Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').orderBy('Age desc, Price asc');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].Name, 'C');
  assert.equal(result[1].Name, 'B');
  assert.equal(result[2].Name, 'A');
});

test('adapter | js | skip-top', (assert) => {
  const data = [
    { Name: 'A', Price: 200, Age: 10 },
    { Name: 'B', Price: 100, Age: 10 },
    { Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'AnyUnknownModel').skip(1).top(1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Name, 'B');
});
