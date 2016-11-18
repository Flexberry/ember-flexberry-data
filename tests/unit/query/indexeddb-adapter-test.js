import Dexie from 'npm:dexie';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import IndexedDbAdapter from 'ember-flexberry-data/query/indexeddb-adapter';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from 'ember-flexberry-data/query/predicate';
import Condition from 'ember-flexberry-data/query/condition';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');
const dexie = app.__container__.lookup('service:dexie');
const databasePrefix = 'testDB2';
const modelName = 'employee';
const schema = (dbName) => {
  let object = {};
  object[dbName] = {
    1: {
      employee: 'id,Age,Name,Surname,CountryName,Price,Active,Country,Creator,Manager,*Tags',
      creator: 'id,Name,Age,Country',
      country: 'id,Name',
      tag: 'id,Name,Creator'
    },
  };
  return object;
};

module('query');

test('adapter | indexeddb | without predicate', (assert) => {
  let data = {
    employee: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ],
  };

  let builder = new QueryBuilder(store, modelName);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 2);
    assert.equal(result.data[2].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | eq', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A' },
      { id: 2, Name: 'B' },
      { id: 3, Name: 'B' },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Eq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 2);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | eq | null', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A' },
      { id: 2, Name: null },
      { id: 3, Name: 'B' },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Eq, null);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | eq | master pk', function (assert) {
  let data = {
    employee: [
      { id: 1, Manager: 3 },
      { id: 2, Manager: 3 },
      { id: 3 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Manager', FilterOperator.Eq, 3);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | eq | master field', function (assert) {
  let data = {
    employee: [
      { id: 1, Manager: 4 },
      { id: 2 },
      { id: 3, Manager: 5 },
      { id: 4, Name: 'X' },
      { id: 5, Name: 'Y' },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Manager.Name', FilterOperator.Eq, 'Y');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | neq', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Neq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | le', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Le, 12);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | leq', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Leq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | ge', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Ge, 10);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 2);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | geq', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Geq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 2);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | string predicate | contains', (assert) => {
  let data = {
    employee: [
      { id: 1, CountryName: 'Argentina' },
      { id: 2, CountryName: 'Paragwaj' },
      { id: 3, CountryName: 'Russia' },
    ],
  };

  let sp1 = new StringPredicate('CountryName').contains('i');
  let builder = new QueryBuilder(store, modelName).where(sp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | string predicate | contains | master field', (assert) => {
  let data = {
    employee: [
      { id: 1, Country: 1 },
      { id: 2, Country: 2 },
      { id: 3, Country: 3 },
    ],
    country: [
      { id: 1, Name: 'Argentina', },
      { id: 2, Name: 'Paragwaj', },
      { id: 3, Name: 'Russia', },
    ],
  };

  let sp1 = new StringPredicate('Country.Name').contains('i');
  let builder = new QueryBuilder(store, modelName).where(sp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | all | simple predicate', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1] },
      { id: 2 },
      { id: 3 },
    ],
    tag: [
      { id: 1, Name: 'Tag1' },
    ],
  };

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | all | simple predicate | master field', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1] },
      { id: 2 },
      { id: 3 },
    ],
    creator: [
      { id: 1, Name: 'X' },
    ],
    tag: [
      { id: 1, Creator: 1 },
    ],
  };

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | any | simple predicate', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1, 3] },
      { id: 2, Tags: [3, 2] },
      { id: 3, Tags: [2, 1] },
    ],
    tag: [
      { id: 1, Name: 'Tag1' },
      { id: 2, Name: 'Tag2' },
      { id: 3, Name: 'Tag3' },
    ],
  };

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | any | simple predicate | master field', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1, 3] },
      { id: 2, Tags: [3, 2] },
      { id: 3, Tags: [2, 1] },
    ],
    creator: [
      { id: 1, Name: 'X' },
      { id: 2, Name: 'Y' },
      { id: 3, Name: 'Z' },
    ],
    tag: [
      { id: 1, Creator: 1 },
      { id: 2, Creator: 2 },
      { id: 3, Creator: 3 },
    ],
  };

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | all | complex predicate', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1, 3] },
      { id: 2, Tags: [3, 2] },
      { id: 3, Tags: [2, 1] },
    ],
    tag: [
      { id: 1, Name: 'Tag1' },
      { id: 2, Name: 'Tag2' },
      { id: 3, Name: 'Tag3' },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag3');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | all | complex predicate | master field', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [1, 3] },
      { id: 2, Tags: [3, 2] },
      { id: 3, Tags: [2, 1] },
    ],
    creator: [
      { id: 1, Name: 'X' },
      { id: 2, Name: 'Y' },
      { id: 3, Name: 'Z' },
    ],
    tag: [
      { id: 1, Creator: 1 },
      { id: 2, Creator: 2 },
      { id: 3, Creator: 3 },
    ],
  };

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | any | complex predicate', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [4, 3] },
      { id: 2, Tags: [3, 1] },
      { id: 3, Tags: [2, 5] },
    ],
    tag: [
      { id: 1, Name: 'Tag1' },
      { id: 2, Name: 'Tag2' },
      { id: 3, Name: 'Tag3' },
      { id: 4, Name: 'Tag4' },
      { id: 5, Name: 'Tag0' },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag2');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 2);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | any | complex predicate', (assert) => {
  let data = {
    employee: [
      { id: 1, Tags: [5, 3] },
      { id: 2, Tags: [3, 1] },
      { id: 3, Tags: [2, 4] },
    ],
    creator: [
      { id: 1, Name: 'X' },
      { id: 2, Name: 'Y' },
      { id: 3, Name: 'Z' },
      { id: 4, Name: 'A' },
      { id: 5, Name: 'M' },
    ],
    tag: [
      { id: 1, Creator: 1 },
      { id: 2, Creator: 2 },
      { id: 3, Creator: 3 },
      { id: 4, Creator: 4 },
      { id: 5, Creator: 5 },
    ],
  };

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Y');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 2);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | complex predicate | and', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'A', Surname: 'Y', Age: 10 },
      { id: 3, Name: 'B', Surname: 'Z', Age: 11 },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).select('Surname').where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].Surname, 'X');
    assert.equal(result.data[1].Surname, 'Y');
  });
});

test('adapter | indexeddb | complex predicate | or', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).select('Surname').where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].Surname, 'X');
    assert.equal(result.data[1].Surname, 'Z');
  });
});

test('adapter | indexeddb | complex predicate | with boolean value', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Active: 'true' },
      { id: 2, Name: 'A', Surname: 'Y', Active: 'false' },
      { id: 3, Name: 'B', Surname: 'Z', Active: 'true' },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Active', FilterOperator.Eq, true);
  let sp3 = new SimplePredicate('Active', FilterOperator.Eq, 'false');
  let cp1 = new ComplexPredicate(Condition.Or, sp2, sp3);
  let cp2 = new ComplexPredicate(Condition.And, sp1, cp1);

  let builder = new QueryBuilder(store, modelName).select('Surname').where(cp2);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].Surname, 'X');
    assert.equal(result.data[1].Surname, 'Y');
  });
});

test('adapter | indexeddb | complex predicate | with nested complex predicate', function (assert) {
  // Arrange.
  let data = {
    employee: [
      { id: 1,  Name: 'A', Surname: 'X', Age: 10 },
      { id: 2,  Name: 'B', Surname: 'Y', Age: 11 },
      { id: 3,  Name: 'C', Surname: 'Z', Age: 12 },
    ],
  };

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp2 = new ComplexPredicate(Condition.And, cp1, sp3);

  // Act && Assert.
  let builder = new QueryBuilder(store, modelName).select('Surname').where(cp2);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].Surname, 'Z');
  });
});

test('adapter | indexeddb | select', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Surname: 'X', Age: 10 },
      { id: 2, Name: 'A', Surname: 'Y', Age: 11 },
      { id: 3, Name: 'B', Surname: 'Z', Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).select('id,Age,Name');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.ok(result.data[0].id);
    assert.ok(result.data[0].Name);
    assert.ok(result.data[0].Age);
    assert.notOk(result.data[0].Surname);
  });
});

test('adapter | indexeddb | order', (assert) => {
  let data = {
    employee: [
      { id: 1, Price: 200, Age: 10 },
      { id: 2, Price: 100, Age: 10 },
      { id: 3, Price: 900, Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).orderBy('Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.equal(result.data[0].id, 3);
    assert.equal(result.data[1].id, 2);
    assert.equal(result.data[2].id, 1);
  });
});

test('adapter | indexeddb | order with skip-top', (assert) => {
  let data = {
    employee: [
      { id: 1, Price: 200, Age: 10 },
      { id: 2, Price: 100, Age: 10 },
      { id: 3, Price: 900, Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).orderBy('Price asc').skip(1).top(2);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

module('performance');

test('adapter | indexeddb | no filter, no order, no skip, no top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName).select('id,Price,Name');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 15000, 'Loading 15000 objects');
  });
});

test('adapter | indexeddb | no filter, order asc, skip, top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
  .orderBy('Price asc')
  .skip(1000)
  .top(20)
  .select('id,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 20, 'Loading 20 objects');
    assert.ok(result.data[0].Price <= result.data[19].Price, 'Check ordering by Price');
  });
});

test('adapter | indexeddb | no filter, order asc, no skip, no top', (assert) => {
  let count = 15000;
  let data = getPerformanceTestData(count, assert);

  let builder = new QueryBuilder(store, modelName)
  .orderBy('Price asc')
  .select('id,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, count, `Loading ${count} objects`);
    assert.ok(result.data[0].Price <= result.data[19].Price, 'Check ordering by Price');
  });
});

test('adapter | indexeddb | no filter, order desc, no skip, no top', (assert) => {
  let count = 15000;
  let data = getPerformanceTestData(count, assert);

  let builder = new QueryBuilder(store, modelName)
  .orderBy('Price desc')
  .select('id,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, count, `Loading ${count} objects`);
    assert.ok(result.data[0].Price >= result.data[19].Price, 'Check ordering by Price');
  });
});

test('adapter | indexeddb | filter, no order, skip, top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, 7500)
    .skip(1000)
    .top(20)
    .select('id,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 20, 'Loading 20 objects');
    assert.ok(result.data[10].Price >= 7500, 'Check filter apply');
  });
});

test('adapter | indexeddb | filter, order asc, no skip, no top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, 7500)
    .orderBy('Name asc')
    .select('id,Price,Name');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.ok(result.data[10].Price >= 7500, 'Check filter apply');
    assert.ok(result.data[0].Name <= result.data[19].Name, 'Check ordering by Name');
  });
});

test('adapter | indexeddb | filter, order desc, no skip, no top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, 7500)
    .orderBy('Name desc')
    .select('id,Price,Name');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.ok(result.data[10].Price >= 7500, 'Check filter apply');
    assert.ok(result.data[0].Name >= result.data[19].Name, 'Check ordering by Name');
  });
});

test('adapter | indexeddb | filter, many order asc desc, no skip, no top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, 7500)
    .orderBy('Age asc,Name desc')
    .select('id,Age,Name,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.ok(result.data[10].Price >= 7500, 'Check filter apply');
    assert.ok(result.data[0].Age <= result.data[19].Age, 'Check ordering by Age');
    assert.ok(result.data[0].Name >= result.data[1].Name, 'Check ordering by Name');
  });
});

test('adapter | indexeddb | filter, many order asc desc, skip, top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, 7500)
    .orderBy('Age asc,Name desc')
    .skip(1000)
    .top(20)
    .select('id,Age,Name,Price');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 20, 'Loading 20 objects');
    assert.ok(result.data[10].Price >= 7500, 'Check filter apply');
    assert.ok(result.data[0].Age <= result.data[19].Age, 'Check ordering by Age');
    assert.ok(result.data[0].Name >= result.data[1].Name || !result.data[0].Name || !result.data[1].Name, 'Check ordering by Name');
  });
});

module('Performance joins');

test('adapter | indexeddb | joins, no filter, many order asc desc, skip, top', (assert) => {
  let count = 15000;
  let data = getJoinsPerformanceTestData(count, assert);

  let builder = new QueryBuilder(store, modelName)
    .where('Price', FilterOperator.Geq, count / 2)
    .orderBy('Country.Name desc,Age asc,Name desc')
    .skip(count / 10)
    .top(20)
    .selectByProjection('TestJoins');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 20, 'Loading 20 objects');
    assert.ok(result.data[10].Price >= count / 2, 'Check filter apply');
  });
});

module('query masters');

test('adapter | indexeddb | order | master field', (assert) => {
  let data = {
    employee: [
      { id: 1, Price: 200, Creator: 1 },
      { id: 2, Price: 100, Creator: 1 },
      { id: 3, Price: 900, Creator: 2 },
    ],
    creator: [
      { id: 1, Age: 10 },
      { id: 2, Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).orderBy('Creator.Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.equal(result.data[0].id, 3);
    assert.equal(result.data[1].id, 2);
    assert.equal(result.data[2].id, 1);
  });
});

test('adapter | indexeddb | skip-top-count', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Price: 200, Age: 10 },
      { id: 2, Name: 'B', Price: 100, Age: 10 },
      { id: 3, Name: 'C', Price: 900, Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).select('Name').count().skip(1).top(1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.meta.count, 3);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].Name, 'B');
  });
});

test('adapter | indexeddb | by id', (assert) => {
  let data = {
    employee: [
      { id: 1, Name: 'A', Price: 200, Age: 10 },
      { id: 2, Name: 'B', Price: 100, Age: 10 },
      { id: 3, Name: 'C', Price: 900, Age: 15 },
    ],
  };

  let builder = new QueryBuilder(store, modelName).select('Name').byId(1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[0].Name, 'A');
  });
});

/**
 * Executes asyncronuous test with temp IndexedDB.
 *
 * @param {Object[]} data Objects for initializing temp database.
 * @param {Query} query Query language instance for loading data.
 * @param {QUnit.Assert} assert
 * @param {Function} callback Function for check loaded data.
 */
function executeTest(data, query, assert, callback) {
  let done = assert.async();
  let dbName = databasePrefix + Math.random();

  let checkResult = (result, db, startExecTime) => {
    try {
      callback(result, startExecTime);
    } finally {
      db.close();
      deleteTempDb(dbName).finally(done);
    }
  };

  let failQuery = (error, db) => {
    assert.notOk(true, 'Error in executing query: ' + error);
    db.close();
    deleteTempDb(dbName).finally(done);
  };

  let queryTempDb = () => {
    store.set('offlineSchema', schema(dbName));
    let db = dexie.dexie(dbName, store);
    db.open().then((db) => {
      let startExecTime = window.performance.now();
      new IndexedDbAdapter(db).query(query).then((result) => {
        checkResult(result, db, startExecTime);
      }).catch((error) => {
        failQuery(error, db);
      });
    });
  };

  let failCreateTempDb = (e) => {
    assert.notOk(true, 'Error in creating temp DB: ' + e);
    deleteTempDb(dbName).finally(done);
  };

  createTempDb(dbName, data).then(queryTempDb).catch(failCreateTempDb);
}

/**
 * Deletes temp IndexedDB database.
 *
 * @param {String} dbName The name of temp database.
 * @returns {Dexie.Promise}
 */
function deleteTempDb(dbName) {
  return new Dexie(dbName).delete();
}

/**
 * Creates temp IndexedDB database.
 *
 * @param {String} dbName The name of temp database.
 * @param {Object[]} data Objects for initializing temp database.
 * @returns {Dexie.Promise}
 */
function createTempDb(dbName, data) {
  store.set('offlineSchema', schema(dbName));
  let db = dexie.dexie(dbName, store);
  return db.open().then((db) => {
    let promises = [];
    for (let table in data) {
      promises.push(db.table(table).bulkAdd(data[table]));
    }

    return Dexie.Promise.all(promises).then(db.close);
  });
}

/**
 * Creates temp data for IndexedDB database.
 *
 * @param {Number} count Count of creating objects.
 * @param {QUnit.Assert} assert
 * @returns {Object[]} data Objects for temp database.
 */
function getPerformanceTestData(count, assert) {
  let creatingStartTime = window.performance.now();
  let data = {
    employee: [
      { id: 1, Price: 200, Age: 10, Name: 'Felix' },
      { id: 2, Price: 100, Age: 10, Name: 'Edward' },
      { id: 3, Price: 900, Age: 15, Name: 'George' },
    ]
  };
  for (let i = 4; i <= count; i++)
  {
    data.employee.push({
      id: i,
      Price: Math.floor(Math.random() * 9) > 3 ? 200 + Math.floor(Math.random() * count) : null,
      Age:  Math.floor(Math.random() * 9) > 1 ? 10 + Math.floor(Math.random() * 99) : null,
      Name:  Math.floor(Math.random() * 9) > 1 ? `King of Kongo Ololong ${Math.floor(Math.random() * count)}` : null
    });
  }

  let creatingEndTime = window.performance.now();
  assert.ok(true, `${Math.round(creatingEndTime - creatingStartTime)} ms construct ${data.employee.length} objects time`);
  return data;
}

/**
 * Creates temp data for IndexedDB database.
 *
 * @param {Number} count Count of creating objects.
 * @param {QUnit.Assert} assert
 * @returns {Object[]} data Objects for temp database.
 */
function getJoinsPerformanceTestData(count, assert) {
  let creatingStartTime = window.performance.now();

  let data = {
    employee: [
      { id: 1, Price: 200, Age: 10, Name: 'Felix', Creator: 1, Country: 1 },
      { id: 2, Price: 100, Age: 10, Name: 'Edward', Creator: 1, Country: 1 },
      { id: 3, Price: 900, Age: 15, Name: 'George', Creator: 2, Country: 1 }
    ],
    creator: [
      { id: 1, Age: 10, Name: 'Felix', Country: 1 },
      { id: 2, Age: 15, Name: 'Felix', Country: 1 },
      { id: 3, Age: 15, Name: 'Felix', Country: 1 }
    ],
    country: [
      { id: 1, Name: 'Austria' },
      { id: 2, Name: 'Australia' },
      { id: 3, Name: 'Belgium' },
    ]
  };

  for (let i = 4; i <= count; i++)
  {
    data.employee.push({
      id: i,
      Price: Math.floor(Math.random() * 9) > 3 ? 200 + Math.floor(Math.random() * count) : null,
      Age: 10 + Math.floor(Math.random() * 99),
      Name: `King of Kongo Ololong ${Math.floor(Math.random() * count)}`,
      Creator: Math.floor(Math.random() * 9) > 3 ? Math.floor(Math.random() * count) : null,
      Country: Math.floor(Math.random() * 9) > 3 ? Math.floor(Math.random() * count) : null
    });
    data.creator.push({
      id: i,
      Age: 10 + Math.floor(Math.random() * 99),
      Name: `Felix ${Math.floor(Math.random() * count)}`,
      Country: Math.floor(Math.random() * 9) > 3 ? Math.floor(Math.random() * count) : null
    });
    data.country.push({
      id: i,
      Name: `Country number .${Math.floor(Math.random() * count)} at Mars`
    });
  }

  let creatingEndTime = window.performance.now();
  assert.ok(true, `${Math.round(creatingEndTime - creatingStartTime)} ms construct ${data.employee.length} objects time`);
  return data;
}
