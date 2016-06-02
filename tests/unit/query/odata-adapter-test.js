import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';
import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';
import startApp from '../../helpers/start-app';

const baseUrl = 'http://services.odata.org/Northwind/Northwind.svc';
const app = startApp();
const store = app.__container__.lookup('service:store');

module('query');

test('adapter odata id', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').byId(42);
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers(42)');
});

test('adapter odata simple predicate eq', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName eq 'Vasya'`);
});

test('adapter odata simple predicate neq', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName ne 'Vasya'`);
});

test('adapter odata simple predicate ge', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Ge, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName gt 'Vasya'`);
});

test('adapter odata simple predicate geq', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Geq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName ge 'Vasya'`);
});

test('adapter odata simple predicate le', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Le, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName lt 'Vasya'`);
});

test('adapter odata simple predicate leq', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Leq, 'Vasya');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName le 'Vasya'`);
});

test('adapter odata string predicate', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('Name').contains('Vasya'));
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=contains(name,'Vasya')`);
});

test('adapter odata string predicate inside complex', function (assert) {
  let stp = new StringPredicate('Name').contains('Vasya');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let builder = new QueryBuilder(store, 'customer').where(stp.and(sp));
  let adapter = new ODataAdapter(baseUrl, store);
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=contains(name,'Vasya') and firstName eq 'Vasya'`);
});

test('adapter odata complex predicate', function (assert) {
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2, sp3);

  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').where(cp1);
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customers?$filter=firstName eq 'Vasya' or lastName eq 'Ivanov' or age eq 10`);
});

test('adapter odata order', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').orderBy('firstName asc, Value desc, Third');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$orderby=firstName asc,Value desc,Third');
});

test('adapter odata skip', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').skip(10);
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$skip=10');
});

test('adapter odata top', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').top(20);
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$top=20');
});

test('adapter odata count', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').count();
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$count=true');
});

test('adapter odata expand', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').expand('Prop1,Prop2').expand('Prop3,Prop2');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$expand=Prop1,Prop2,Prop3');
});

test('adapter odata select', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'customer').select('Prop1,Prop2').select('Prop3,Prop2');
  let url = adapter.getODataFullUrl(builder.build());

  assert.equal(url, baseUrl + '/Customers?$select=Prop1,Prop2,Prop3');
});
