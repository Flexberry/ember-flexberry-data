import { run } from '@ember/runloop';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import JSAdapter from 'ember-flexberry-data/query/js-adapter';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import {
  SimplePredicate,
  DatePredicate,
  ComplexPredicate,
  StringPredicate,
  DetailPredicate,
  GeographyPredicate,
  GeometryPredicate,
  TruePredicate,
  FalsePredicate
} from 'ember-flexberry-data/query/predicate';

import startApp from '../../helpers/start-app';
import { AttributeParam, ConstParam } from 'ember-flexberry-data/query/parameter';

let app;
let store;
let moment;
let adapter;

module('js-adapter-test', {
  beforeEach() {
    app = startApp();

    if (app) {
      store = app.__container__.lookup('service:store');
      moment = app.__container__.lookup('service:moment');
      adapter = new JSAdapter(moment);
    }
  },

  afterEach() {
    run(app, 'destroy');
  },
});

const filterData = [
  { 
    id: 1, 
    Name: 'A', 
    Surname: 'X', 
    Age: 10, 
    Email: null, 
    Manager: { id: 1, Name: 'X' },
    'Birth Date': 'Wed Jan 31 2018 08:30:00', 
    employmentDate: 'Thu Jan 30 2018 08:30:00'
  },
  { 
    id: 2, 
    Name: 'B', 
    Surname: 'B', 
    Age: 11, 
    Email: 'flex@ber.ry',
    'Birth Date': 'Wed Jan 31 2018 07:30:00', 
    employmentDate: null 
  },
  { 
    id: 3, 
    Name: 'B', 
    Surname: 'Z', 
    Age: 12, 
    Email: 'flex@ber.ry', 
    Manager: { id: 3, Name: 'Y' },
    'Birth Date': null , 
    employmentDate: 'Wed Jan 31 2018 08:30:00'
  },
  { 
    id: 4, 
    Name: 'C', 
    Surname: null, 
    Age: 37, 
    Email: 'flex@ber.ry2',
    'Birth Date': 'Wed Jan 31 2018 08:30:00', 
    employmentDate: 'Wed Jan 31 2018 09:30:00'
  }
];

const filterDataExtended = [
  { 
    id: 1, 
    Address: 'A', 
    Text: 'X',
    author: { id: 1, name: 'X', birthday: 'Wed Jan 31 2018 08:30:00' }, 
    editor1: { id: 1, name: 'K', birthday: 'Thu Jan 30 2018 08:30:00' }
  },
  { 
    id: 2, 
    Address: 'B', 
    Text: 'B'
  },
  { 
    id: 3, 
    Address: 'B', 
    Text: 'Z',
    author: { id: 3, name: 'Y', birthday: 'Wed Jan 31 2018 08:30:00' }, 
    editor1: { id: 7, name: 'Y', birthday: 'Wed Jan 31 2018 07:30:00' }
  },
  { 
    id: 4, 
    Address: 'C', 
    Text: null, 
    author: { id: 8, name: null, birthday: 'Wed Jan 31 2018 08:30:00' } 
  }
];

let filterDataTotalCount = filterData.length;

test('adapter | js | without predicate', (assert) => {
  const data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'A', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'employee');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 2);
  assert.equal(result[2].id, 3);
});

test('adapter | js | simple predicate | eq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Name', FilterOperator.Eq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | eq | AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Eq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'B');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | eq | ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Name', FilterOperator.Eq, new ConstParam('B'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'B');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | eq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Eq, new ConstParam('B'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'B');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | eq | two same AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Eq, new AttributeParam('Name'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, filterDataTotalCount);
});

test('adapter | js | simple predicate | eq | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Eq, new AttributeParam('Surname'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Surname, 'B');
});

test('adapter | js | simple predicate | eq | two same ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new ConstParam('Name'), FilterOperator.Eq, new ConstParam('Name'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, filterDataTotalCount);
});

test('adapter | js | simple predicate | eq | two ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new ConstParam('Name'), FilterOperator.Eq, new ConstParam('Surname'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | simple predicate | eq | null', (assert) => {
  const data = [
    { id: 1, Surname: 'X' },
    { id: 2, Surname: null },
    { id: 3, Surname: 'Z' }
  ];

  let builder = new QueryBuilder(store, 'employee').where('Surname', FilterOperator.Eq, null);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('adapter | js | simple predicate | eq | null | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').where(new AttributeParam('Surname'), FilterOperator.Eq, new ConstParam(null));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 4);
});

test('adapter | js | simple predicate | eq | master pk', function (assert) {
  const data = [
    { id: 1, Manager: { id: 1 } },
    { id: 2 },
    { id: 3, Manager: { id: 3 } }
  ];

  let builder = new QueryBuilder(store, 'customer').where('Manager', FilterOperator.Eq, 3);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 3);
});

test('adapter | js | simple predicate | eq | master pk | AttributeParam and ConstParam', function (assert) {
  const data = filterData;

  let builder = new QueryBuilder(store, 'customer').where(new AttributeParam('Manager'), FilterOperator.Eq, new ConstParam(3));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 3);
});

test('adapter | js | simple predicate | eq | master pk | two AttributeParam', function (assert) {
  // TODO: add support of variant without id.
  const data = filterDataExtended;

  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(new AttributeParam('author.id'), FilterOperator.Eq, new AttributeParam('editor1.id'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);

  // Null is not accepted for equal.
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('adapter | js | simple predicate | eq | master field', function (assert) {
  const data = [
    { id: 1, Manager: { Name: 'X' } },
    { id: 2 },
    { id: 3, Manager: { Name: 'Y' } }
  ];

  let builder = new QueryBuilder(store, 'customer').where('Manager.Name', FilterOperator.Eq, 'Y');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 3);
});

test('adapter | js | simple predicate | eq | master field | AttributeParam and ConstParam', function (assert) {
  const data = filterData;

  let builder = new QueryBuilder(store, 'customer').where(new AttributeParam('Manager.Name'), FilterOperator.Eq, new ConstParam('Y'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 3);
});

test('adapter | js | simple predicate | eq | master field | two AttributeParam', function (assert) {
  const data = filterDataExtended;

  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(new AttributeParam('author.name'), FilterOperator.Eq, new AttributeParam('editor1.name'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 3);
});

test('adapter | js | simple predicate | neq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Name', FilterOperator.Neq, 'B');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | neq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Neq, new ConstParam('B'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, null);
});

test('adapter | js | simple predicate | neq | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Neq, new AttributeParam('Surname'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
  assert.equal(result[2].Surname, null);
});

test('adapter | js | simple predicate | le', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Age', FilterOperator.Le, 12);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Y');
});

test('adapter | js | simple predicate | le | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Le, new ConstParam(12));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'B');
});

test('adapter | js | simple predicate | le | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Le, new AttributeParam('Surname'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | leq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Age', FilterOperator.Leq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Y');
});

test('adapter | js | simple predicate | leq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Leq, new ConstParam(11));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'B');
});

test('adapter | js | simple predicate | leq | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Leq, new AttributeParam('Age'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, filterDataTotalCount);
});

test('adapter | js | simple predicate | ge', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Age', FilterOperator.Ge, 10);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | ge | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Ge, new ConstParam(10));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].Surname, 'B');
  assert.equal(result[1].Surname, 'Z');
  assert.equal(result[2].Surname, null);
});

test('adapter | js | simple predicate | ge | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Ge, new AttributeParam('Age'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | simple predicate | geq', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Surname').where('Age', FilterOperator.Geq, 11);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'Y');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | simple predicate | geq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Age'), FilterOperator.Geq, new ConstParam(10));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, filterDataTotalCount);
});

test('adapter | js | simple predicate | geq | two AttributeParam', (assert) => {
  const data = filterData;

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(new AttributeParam('Name'), FilterOperator.Geq, new AttributeParam('Surname'));
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('adapter | js | string predicate | contains', (assert) => {
  const data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let sp1 = new StringPredicate('Country').contains('i');
  let builder = new QueryBuilder(store, 'employee').where(sp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 3);
});

test('adapter | js | string predicate | contains | master field', (assert) => {
  const data = [
    { id: 1, Country: { Name: 'Argentina' } },
    { id: 2, Country: { Name: 'Paragwaj' } },
    { id: 3, Country: { Name: 'Russia' } }
  ];

  let sp1 = new StringPredicate('Country.Name').contains('i');
  let builder = new QueryBuilder(store, 'employee').where(sp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 3);
});

test('adapter | js | detail predicate | all | simple predicate', (assert) => {
  const data = [
    { id: 1, Tags: [{ Name: 'Tag1' }] },
    { id: 2 },
    { id: 3 }
  ];

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('adapter | js | detail predicate | all | simple predicate | master field', (assert) => {
  const data = [
    { id: 1 },
    { id: 2, Tags: [{ Creator: { Name: 'X' } }] },
    { id: 3 }
  ];

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('adapter | js | detail predicate | any | simple predicate', (assert) => {
  const data = [
    { id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 3);
});

test('adapter | js | detail predicate | any | simple predicate | master field', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'X' } }, { Creator: { Name: 'Y' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'Z' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] }
  ];

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 3);
});

test('adapter | js | detail predicate | all | complex predicate', (assert) => {
  const data = [
    { id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag3');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('adapter | js | detail predicate | all | complex predicate | master field', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'X' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'Y' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'X' } }] }
  ];

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('adapter | js | detail predicate | any | complex predicate', (assert) => {
  const data = [
    { id: 1, Tags: [{ Name: 'Tag4' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag1' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag0' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag2');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 2);
  assert.equal(result[1].id, 3);
});

test('adapter | js | detail predicate | any | complex predicate | master field', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] }
  ];

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Y');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 2);
  assert.equal(result[1].id, 3);
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

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(cp1);
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

  let builder = new QueryBuilder(store, 'employee').select('Surname').where(cp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
  assert.equal(result[0].Surname, 'X');
  assert.equal(result[1].Surname, 'Z');
});

test('adapter | js | complex predicate | with nested complex predicate', function (assert) {
  // Arrange.
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'B', Surname: 'Y', Age: 11 },
    { Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp2 = new ComplexPredicate(Condition.And, cp1, sp3);

  // Act.
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(cp2);
  let filter = adapter.buildFunc(builder.build());

  // Assert.
  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Surname, 'Z');
});

test('adapter | js | select', (assert) => {
  const data = [
    { Name: 'A', Surname: 'X', Age: 10 },
    { Name: 'A', Surname: 'Y', Age: 11 },
    { Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Age,Name');
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

  let builder = new QueryBuilder(store, 'employee').select('Name').orderBy('Age desc, Price asc');
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].Name, 'C');
  assert.equal(result[1].Name, 'B');
  assert.equal(result[2].Name, 'A');
});

test('adapter | js | order | master field', (assert) => {
  const data = [
    { Name: 'A', Price: 200, Creator: { Age: 10 } },
    { Name: 'B', Price: 100, Creator: { Age: 10 } },
    { Name: 'C', Price: 900, Creator: { Age: 15 } }
  ];

  let builder = new QueryBuilder(store, 'employee').select('Name').orderBy('Creator.Age desc, Price asc');
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

  let builder = new QueryBuilder(store, 'employee').select('Name').skip(1).top(1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].Name, 'B');
});

test('adapter | js | geography predicate | intersects', (assert) => {
  const data = [
    { id: 1, Coordinates: 'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' },
    { id: 2, Coordinates: 'SRID=12346;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' },
    { id: 3, Coordinates: 'SRID=12347;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' }
  ];

  let sp1 = new GeographyPredicate('Coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');
  let builder = new QueryBuilder(store, 'employee').where(sp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 2);
  assert.equal(result[2].id, 3);
});

test('adapter | js | geometry predicate | intersects', (assert) => {
  const data = [
    { id: 1, Coordinates: 'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' },
    { id: 2, Coordinates: 'SRID=12346;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' },
    { id: 3, Coordinates: 'SRID=12347;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))' }
  ];

  let sp1 = new GeometryPredicate('Coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');
  let builder = new QueryBuilder(store, 'employee').where(sp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 2);
  assert.equal(result[2].id, 3);
});

test('adapter | js | true predicate', (assert) => {
  const data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let tp1 = new TruePredicate();
  let builder = new QueryBuilder(store, 'employee').where(tp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | true predicate | complex predicate', (assert) => {
  const data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let sp1 = new SimplePredicate('Country', FilterOperator.Eq, 'Argentina');
  let tp1 = new TruePredicate();

  let cp1 = new ComplexPredicate(Condition.Or, sp1, tp1);
  let builder = new QueryBuilder(store, 'employee').where(cp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);

  cp1 = new ComplexPredicate(Condition.And, sp1, tp1);
  builder = new QueryBuilder(store, 'employee').where(cp1);
  filter = adapter.buildFunc(builder.build());

  result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | true predicate | detail predicate any', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] },
    { id: 4, Tags: [] },
  ];

  let dp = new DetailPredicate('Tags').any(new TruePredicate());
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | true predicate | detail predicate all', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] },
    { id: 4, Tags: [] },
  ];

  let dp = new DetailPredicate('Tags').all(new TruePredicate());
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 4);
});

test('adapter | js | false predicate', (assert) => {
  const data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let fp1 = new FalsePredicate();
  let builder = new QueryBuilder(store, 'employee').where(fp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | false predicate | complex predicate', (assert) => {
  const data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let sp1 = new SimplePredicate('Country', FilterOperator.Eq, 'Argentina');
  let fp1 = new FalsePredicate();

  let cp1 = new ComplexPredicate(Condition.Or, sp1, fp1);
  let builder = new QueryBuilder(store, 'employee').where(cp1);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);

  cp1 = new ComplexPredicate(Condition.And, sp1, fp1);
  builder = new QueryBuilder(store, 'employee').where(cp1);
  filter = adapter.buildFunc(builder.build());

  result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | false predicate | detail predicate any', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] },
    { id: 4, Tags: [] },
  ];

  let dp = new DetailPredicate('Tags').any(new FalsePredicate());
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | false predicate | detail predicate all', (assert) => {
  const data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] },
    { id: 4, Tags: [] },
  ];

  let dp = new DetailPredicate('Tags').all(new FalsePredicate());
  let builder = new QueryBuilder(store, 'employee').where(dp);

  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | eq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Eq, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
});

test('adapter | js | date predicate | timeless | eq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Eq, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | date predicate | eq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Eq, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | timeless | eq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Eq, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | neq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Neq, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
});

test('adapter | js | date predicate | timeless | neq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Neq, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | neq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Neq, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 4);
});

test('adapter | js | date predicate | timeless | neq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Neq, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | date predicate | le | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Le, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | timeless | le | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Le, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | le | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Le, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | timeless | le | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Le, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | leq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Leq, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | date predicate | timeless | leq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Leq, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | date predicate | leq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Leq, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | timeless | leq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Leq, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | ge | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Ge, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | timeless | ge | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Ge, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | ge | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Ge, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | timeless | ge | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Ge, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | geq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Geq, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
});

test('adapter | js | date predicate | timeless | geq | AttributeParam and ConstParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Geq, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 3);
});

test('adapter | js | date predicate | geq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Geq, new AttributeParam('employmentDate'))
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | timeless | geq | two AttributeParam', (assert) => {
  const data = filterData;

  let dp = new DatePredicate(new AttributeParam('Birth Date'), FilterOperator.Geq, new AttributeParam('employmentDate'), true)
  let builder = new QueryBuilder(store, 'employee').select('Surname').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 2);
});

test('adapter | js | date predicate | eq with master | AttributeParam and ConstParam', (assert) => {
  const data = filterDataExtended;

  let dp = new DatePredicate(new AttributeParam('editor1.birthday'), FilterOperator.Eq, new ConstParam('Wed Jan 31 2018 08:30:00'))
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | timeless | eq with master | AttributeParam and ConstParam', (assert) => {
  const data = filterDataExtended;

  let dp = new DatePredicate(new AttributeParam('editor1.birthday'), FilterOperator.Eq, new ConstParam('Wed Jan 31 2018 08:30:00'), true)
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});

test('adapter | js | date predicate | eq with master | two AttributeParam', (assert) => {
  const data = filterDataExtended;

  let dp = new DatePredicate(new AttributeParam('author.birthday'), FilterOperator.Eq, new AttributeParam('editor1.birthday'))
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 0);
});

test('adapter | js | date predicate | timeless | eq with master | two AttributeParam', (assert) => {
  const data = filterDataExtended;

  let dp = new DatePredicate(new AttributeParam('author.birthday'), FilterOperator.Eq, new AttributeParam('editor1.birthday'), true)
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion').where(dp);
  let filter = adapter.buildFunc(builder.build());

  let result = filter(data);
  assert.ok(result);
  assert.equal(result.length, 1);
});