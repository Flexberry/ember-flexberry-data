import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from 'ember-flexberry-data/query/predicate';
import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';
import startApp from '../../helpers/start-app';

const baseUrl = 'http://services.odata.org/Northwind/Northwind.svc';
const app = startApp();
const store = app.__container__.lookup('service:store');
const adapter = new ODataAdapter(baseUrl, store);

module('query');

test('adapter | odata | id', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').byId(42);

  // Act && Assert.
  runTest(assert, builder, '/Customers(42)');
});

test('adapter | odata | simple predicate | eq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name eq 'Vasya'`);
});

test('adapter | odata | simple predicate | eq | null', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, null);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name eq null`);
});

test('adapter | odata | simple predicate | eq | master field', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('manager', FilterOperator.Eq, '3bcc4730-9cc1-4237-a843-c4b1de881d7c');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=manager/__PrimaryKey eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c`);
});

test('adapter | odata | simple predicate | eq | master field', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('manager.First Name', FilterOperator.Eq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=manager/first-name eq 'Vasya'`);
});

test('adapter | odata | simple predicate | neq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name ne 'Vasya'`);
});

test('adapter | odata | simple predicate | neq | null', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, null);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name ne null`);
});

test('adapter | odata | simple predicate | ge', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Ge, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name gt 'Vasya'`);
});

test('adapter | odata | simple predicate | geq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Geq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name ge 'Vasya'`);
});

test('adapter | odata | simple predicate | le', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Le, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name lt 'Vasya'`);
});

test('adapter | odata | simple predicate | leq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Leq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name le 'Vasya'`);
});

test('adapter | odata | string predicate', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('firstName').contains('a'));

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=contains(first-name,'a')`);
});

test('adapter | odata | string predicate | inside complex', function (assert) {
  // Arrange.
  let stp = new StringPredicate('firstName').contains('a');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(stp.and(sp));

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=contains(first-name,'a') and first-name eq 'Vasya'`);
});

test('adapter | odata | detail predicate | all | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').all(new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya')`);
});

test('adapter | odata | detail predicate | any | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').any(new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/any(f:f/first-name eq 'Vasya')`);
});

test('adapter | odata | detail predicate | all | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').all(new StringPredicate('firstName').contains('Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/all(contains(f:f/first-name,'Vasya'))`);
});

test('adapter | odata | detail predicate | any | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').any(new StringPredicate('firstName').contains('Vasya'));
  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/any(contains(f:f/first-name,'Vasya'))`);
});

test('adapter | odata | detail predicate | all | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('DetailName').all(cp1);

  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya' or f:f/last-name eq 'Ivanov')`);
});

test('adapter | odata | detail predicate | any | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);
  let dp = new DetailPredicate('DetailName').all(cp1);

  let builder = new QueryBuilder(store, 'customer').where(dp);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya' and f:f/last-name eq 'Ivanov')`);
});

test('adapter | odata | complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2, sp3);

  let builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=first-name eq 'Vasya' or last-name eq 'Ivanov' or age eq 10`);
});

test('adapter | odata | complex predicate | with nested complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp2 = new ComplexPredicate(Condition.And, cp1, sp3);

  let builder = new QueryBuilder(store, 'customer').where(cp2);

  // Act && Assert.
  runTest(assert, builder, `/Customers?$filter=(first-name eq 'Vasya' or last-name eq 'Ivanov') and age eq 10`);
});

test('adapter | odata | order', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').orderBy('firstName,lastName asc,age desc,manager.First Name,manager.Last Name asc,manager.Birth Date desc');

  // Act && Assert.
  runTest(assert, builder, '/Customers?$orderby=first-name,last-name asc,age desc,manager/first-name,manager/last-name asc,manager/birth-date desc');
});

test('adapter | odata | skip', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').skip(10);

  // Act && Assert.
  runTest(assert, builder, '/Customers?$skip=10');
});

test('adapter | odata | top', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').top(20);

  // Act && Assert.
  runTest(assert, builder, '/Customers?$top=20');
});

test('adapter | odata | count', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').count();

  // Act && Assert.
  runTest(assert, builder, '/Customers?$count=true');
});

test('adapter | odata | expand', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').expand('Prop1,Prop2').expand('Prop3,Prop2');

  // Act && Assert.
  runTest(assert, builder, '/Customers?$expand=Prop1,Prop2,Prop3');
});

test('adapter | odata | select', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').select('Prop1,Prop2').select('Prop3,Prop2');

  // Act && Assert.
  runTest(assert, builder, '/Customers?$select=Prop1,Prop2,Prop3');
});

function runTest(assert, builder, expectedUrl) {
  let url = adapter.getODataFullUrl(builder.build());
  assert.equal(url, baseUrl + expectedUrl);
}
