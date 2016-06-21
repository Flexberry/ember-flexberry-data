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
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').byId(42);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers(42)');
});

test('adapter | odata | simple predicate | eq', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name eq 'Vasya'`);
});

test('adapter | odata | simple predicate | neq', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name ne 'Vasya'`);
});

test('adapter | odata | simple predicate | ge', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Ge, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name gt 'Vasya'`);
});

test('adapter | odata | simple predicate | geq', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Geq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name ge 'Vasya'`);
});

test('adapter | odata | simple predicate | le', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Le, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name lt 'Vasya'`);
});

test('adapter | odata | simple predicate | leq', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Leq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name le 'Vasya'`);
});

test('adapter | odata | string predicate', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('Name').contains('Vasya'));
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=contains(name,'Vasya')`);
});

test('adapter | odata | string predicate | inside complex', function (assert) {
  // Arrange.
  let stp = new StringPredicate('Name').contains('Vasya');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(stp.and(sp));
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=contains(name,'Vasya') and first-name eq 'Vasya'`);
});

test('adapter | odata | detail predicate | all | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').all(new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya')`);
});

test('adapter | odata | detail predicate | any | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').any(new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/any(f:f/first-name eq 'Vasya')`);
});

test('adapter | odata | detail predicate | all | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').all(new StringPredicate('Name').contains('Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/all(contains(f:f/name,'Vasya'))`);
});

test('adapter | odata | detail predicate | any | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('DetailName').any(new StringPredicate('Name').contains('Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/any(contains(f:f/name,'Vasya'))`);
});

test('adapter | odata | detail predicate | all | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('DetailName').all(cp1);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya' or f:f/last-name eq 'Ivanov')`);
});

test('adapter | odata | detail predicate | any | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);
  let dp = new DetailPredicate('DetailName').all(cp1);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(dp);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=DetailName/all(f:f/first-name eq 'Vasya' and f:f/last-name eq 'Ivanov')`);
});

test('adapter | odata | complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2, sp3);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(cp1);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, `${baseUrl}/Customers?$filter=first-name eq 'Vasya' or last-name eq 'Ivanov' or age eq 10`);
});

test('adapter | odata | order', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').orderBy('firstName asc, Value desc, Third');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$orderby=firstName asc,Value desc,Third');
});

test('adapter | odata | skip', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').skip(10);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$skip=10');
});

test('adapter | odata | top', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').top(20);
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$top=20');
});

test('adapter | odata | count', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').count();
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$count=true');
});

test('adapter | odata | expand', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').expand('Prop1,Prop2').expand('Prop3,Prop2');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$expand=Prop1,Prop2,Prop3');
});

test('adapter | odata | select', function (assert) {
  // Arrange && Act.
  let builder = new QueryBuilder(store, 'customer').select('Prop1,Prop2').select('Prop3,Prop2');
  let url = adapter.getODataFullUrl(builder.build());

  // Assert.
  assert.equal(url, baseUrl + '/Customers?$select=Prop1,Prop2,Prop3');
});
