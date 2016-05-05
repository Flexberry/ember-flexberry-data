import { module, test } from 'qunit';
import QueryBuilder from 'ember-flexberry-projections/query-builder';
import FilterOperator from 'ember-flexberry-projections/query-filter-operator';
import Condition from 'ember-flexberry-projections/query-condition';
import { SimplePredicate, ComplexPredicate, StringPredicate } from 'ember-flexberry-projections/query-predicate';
import ODataAdapter from 'ember-flexberry-projections/query-odata-adapter';
import startApp from '../helpers/start-app';

const baseUrl = 'http://services.odata.org/Northwind/Northwind.svc';
const app = startApp();
const store = app.__container__.lookup('service:store');

module('query');

test('adapter odata simple predicate', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').where('firstName', 'eq', 'Vasya');
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customer?$filter=firstName eq 'Vasya'`);
});

test('adapter odata string predicate', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').where(new StringPredicate('Name').contains('Vasya'));
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customer?$filter=contains('Name','Vasya')`);
});

test('adapter odata string predicate inside complex', function (assert) {
  let stp = new StringPredicate('Name').contains('Vasya');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let builder = new QueryBuilder(store, 'Customer').where(stp.and(sp));
  let adapter = new ODataAdapter(baseUrl, store);
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customer?$filter=contains('Name','Vasya') and firstName eq 'Vasya'`);
});

test('adapter odata complex predicate', function (assert) {
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2, sp3);

  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').where(cp1);
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, `${baseUrl}/Customer?$filter=firstName eq 'Vasya' or lastName eq 'Ivanov' or age eq 10`);
});

test('adapter odata order', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').orderBy('firstName asc, Value desc, Third');
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$orderby=firstName asc,Value desc,Third');
});

test('adapter odata skip', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').skip(10);
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$skip=10');
});

test('adapter odata top', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').top(20);
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$top=20');
});

test('adapter odata count', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').count();
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$count=true');
});

test('adapter odata expand', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').expand('Prop1,Prop2').expand('Prop3,Prop2');
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$expand=Prop1,Prop2,Prop3');
});

test('adapter odata select', function (assert) {
  let adapter = new ODataAdapter(baseUrl, store);
  let builder = new QueryBuilder(store, 'Customer').select('Prop1,Prop2').select('Prop3,Prop2');
  let url = adapter.getODataUrl(builder.build());

  assert.equal(url, baseUrl + '/Customer?$select=Prop1,Prop2,Prop3');
});
