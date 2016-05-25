import Dexie from 'npm:dexie';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import IndexedDbAdapter from 'ember-flexberry-data/query/indexeddb-adapter';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';
import Condition from 'ember-flexberry-data/query/condition';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');
const databasePrefix = 'testDB2';
const schema = 'Id,Name,Surname,Age';
const modelName = 'employee';

module('query');

test('adapter indexeddb without predicate', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'A', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(3, result.length);
    assert.equal(1, result[0].Id);
    assert.equal(2, result[1].Id);
    assert.equal(3, result[2].Id);
  });
});

test('adapter indexeddb simple predicate eq', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'B', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Eq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(2, result[0].Id);
    assert.equal(3, result[1].Id);
  });
});

test('adapter indexeddb simple predicate neq', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Neq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(1, result[0].Id);
    assert.equal(3, result[1].Id);
  });
});

test('adapter indexeddb simple predicate le', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Le, 12);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(1, result[0].Id);
    assert.equal(2, result[1].Id);
  });
});

test('adapter indexeddb simple predicate leq', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Leq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(1, result[0].Id);
    assert.equal(2, result[1].Id);
  });
});

test('adapter indexeddb simple predicate ge', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Ge, 10);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(2, result[0].Id);
    assert.equal(3, result[1].Id);
  });
});

test('adapter indexeddb simple predicate geq', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Geq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(2, result[0].Id);
    assert.equal(3, result[1].Id);
  });
});

test('adapter indexeddb string predicate contains', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10, Country: 'Argentina' },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11, Country: 'Paragwaj' },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12, Country: 'Russia' }
  ];

  let sp1 = new StringPredicate('Country').contains('i');
  let builder = new QueryBuilder(store, modelName).where(sp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal(1, result[0].Id);
    assert.equal(3, result[1].Id);
  });
});

test('adapter indexeddb complex predicate and', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'A', Surname: 'Y', Age: 10 },
    { Id: 3, Name: 'B', Surname: 'Z', Age: 11 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal('X', result[0].Surname);
    assert.equal('Y', result[1].Surname);
  });
});

test('adapter indexeddb complex predicate or', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(2, result.length);
    assert.equal('X', result[0].Surname);
    assert.equal('Z', result[1].Surname);
  });
});

test('adapter indexeddb select', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { Id: 2, Name: 'A', Surname: 'Y', Age: 11 },
    { Id: 3, Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).select('Id,Age,Name');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(3, result.length);
    assert.ok(result[0].Id);
    assert.ok(result[0].Name);
    assert.ok(result[0].Age);
    assert.notOk(result[0].Surname);
  });
});

test('adapter indexeddb order', (assert) => {
  let data = [
    { Id: 1, Name: 'A', Price: 200, Age: 10 },
    { Id: 2, Name: 'B', Price: 100, Age: 10 },
    { Id: 3, Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).orderBy('Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(3, result.length);
    assert.equal('C', result[0].Name);
    assert.equal('B', result[1].Name);
    assert.equal('A', result[2].Name);
  });
});

test('adapter indexeddb skip-top', (assert) => {
  const data = [
    { Id: 1, Name: 'A', Price: 200, Age: 10 },
    { Id: 2, Name: 'B', Price: 100, Age: 10 },
    { Id: 3, Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).skip(1).top(1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(1, result.length);
    assert.equal('B', result[0].Name);
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

  let checkResult = (result) => {
    try {
      callback(result);
    } finally {
      deleteTempDb(dbName).finally(done);
    }
  };

  let failQuery = (e) => {
    assert.notOk(true, 'Error in executing query: ' + e);
    deleteTempDb(dbName).finally(done);
  };

  let queryTempDb = () => {
    new IndexedDbAdapter(dbName).query(query).then(checkResult, failQuery);
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
  let db = new Dexie(dbName);
  db.version(1).stores({ employee: schema });
  db.open();
  return db.table(modelName).bulkAdd(data).then(db.close);
}
