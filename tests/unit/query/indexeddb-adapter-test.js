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
const databasePrefix = 'testDB2';
const schema = 'id,Name,Surname,Age,Manager.Name';
const modelName = 'employee';

module('query');

test('adapter | indexeddb | without predicate', (assert) => {
  let data = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ];

  let builder = new QueryBuilder(store, modelName);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 2);
    assert.equal(result[2].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | eq', (assert) => {
  let data = [
    { id: 1, Name: 'A' },
    { id: 2, Name: 'B' },
    { id: 3, Name: 'B' }
  ];

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Eq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 2);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | eq | null', (assert) => {
  let data = [
    { id: 1, Name: 'A' },
    { id: 2, Name: null },
    { id: 3, Name: 'B' }
  ];

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Eq, null);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 2);
  });
});

test('adapter | js | simple predicate | eq | master field', function (assert) {
  let data = [
    { id: 1, Manager: { Name: 'X' } },
    { id: 2 },
    { id: 3, Manager: { Name: 'Y' } }
  ];

  let builder = new QueryBuilder(store, modelName).where('Manager.Name', FilterOperator.Eq, 'Y');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | neq', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Name', FilterOperator.Neq, 'B');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | le', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Le, 12);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | leq', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Leq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 2);
  });
});

test('adapter | indexeddb | simple predicate | ge', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Ge, 10);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 2);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | simple predicate | geq', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let builder = new QueryBuilder(store, modelName).where('Age', FilterOperator.Geq, 11);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 2);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | string predicate | contains', (assert) => {
  let data = [
    { id: 1, Country: 'Argentina' },
    { id: 2, Country: 'Paragwaj' },
    { id: 3, Country: 'Russia' }
  ];

  let sp1 = new StringPredicate('Country').contains('i');
  let builder = new QueryBuilder(store, modelName).where(sp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | string predicate | contains | master field', (assert) => {
  let data = [
    { id: 1, Country: { Name: 'Argentina' } },
    { id: 2, Country: { Name: 'Paragwaj' } },
    { id: 3, Country: { Name: 'Russia' } }
  ];

  let sp1 = new StringPredicate('Country.Name').contains('i');
  let builder = new QueryBuilder(store, modelName).where(sp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | all | simple predicate', (assert) => {
  let data = [
    { id: 1, Tags: [{ Name: 'Tag1' }] },
    { id: 2 },
    { id: 3 }
  ];

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | all | simple predicate | master field', (assert) => {
  let data = [
    { id: 1, Tags: [{ Creator: { Name: 'X' } }] },
    { id: 2 },
    { id: 3 }
  ];

  let dp = new DetailPredicate('Tags').all(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | any | simple predicate', (assert) => {
  let data = [
    { id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Name', FilterOperator.Eq, 'Tag1'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | any | simple predicate | master field', (assert) => {
  let data = [
    { id: 1, Tags: [{ Creator: { Name: 'X' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'Y' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'X' } }] }
  ];

  let dp = new DetailPredicate('Tags').any(new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X'));
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 1);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | all | complex predicate', (assert) => {
  let data = [
    { id: 1, Tags: [{ Name: 'Tag1' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag2' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag1' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag3');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | all | complex predicate | master field', (assert) => {
  let data = [
    { id: 1, Tags: [{ Creator: { Name: 'X' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'Y' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'X' } }] }
  ];

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').all(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });
});

test('adapter | indexeddb | detail predicate | any | complex predicate', (assert) => {
  let data = [
    { id: 1, Tags: [{ Name: 'Tag4' }, { Name: 'Tag3' }] },
    { id: 2, Tags: [{ Name: 'Tag3' }, { Name: 'Tag1' }] },
    { id: 3, Tags: [{ Name: 'Tag2' }, { Name: 'Tag0' }] }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag1');
  let sp2 = new SimplePredicate('Name', FilterOperator.Eq, 'Tag2');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 2);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | detail predicate | any | complex predicate', (assert) => {
  let data = [
    { id: 1, Tags: [{ Creator: { Name: 'M' } }, { Creator: { Name: 'Z' } }] },
    { id: 2, Tags: [{ Creator: { Name: 'Z' } }, { Creator: { Name: 'X' } }] },
    { id: 3, Tags: [{ Creator: { Name: 'Y' } }, { Creator: { Name: 'A' } }] }
  ];

  let sp1 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'X');
  let sp2 = new SimplePredicate('Creator.Name', FilterOperator.Eq, 'Y');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('Tags').any(cp1);
  let builder = new QueryBuilder(store, modelName).where(dp);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 2);
    assert.equal(result[1].id, 3);
  });
});

test('adapter | indexeddb | complex predicate | and', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'A', Surname: 'Y', Age: 10 },
    { id: 3, Name: 'B', Surname: 'Z', Age: 11 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].Surname, 'X');
    assert.equal(result[1].Surname, 'Y');
  });
});

test('adapter | indexeddb | complex predicate | or', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let builder = new QueryBuilder(store, modelName).where(cp1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 2);
    assert.equal(result[0].Surname, 'X');
    assert.equal(result[1].Surname, 'Z');
  });
});

test('adapter | indexeddb | complex predicate | with nested complex predicate', function (assert) {
  // Arrange.
  let data = [
    { id: 1,  Name: 'A', Surname: 'X', Age: 10 },
    { id: 2,  Name: 'B', Surname: 'Y', Age: 11 },
    { id: 3,  Name: 'C', Surname: 'Z', Age: 12 }
  ];

  let sp1 = new SimplePredicate('Name', FilterOperator.Eq, 'A');
  let sp2 = new SimplePredicate('Surname', FilterOperator.Eq, 'Z');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('Age', FilterOperator.Eq, 12);
  let cp2 = new ComplexPredicate(Condition.And, cp1, sp3);

  // Act && Assert.
  let builder = new QueryBuilder(store, modelName).where(cp2);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].Surname, 'Z');
  });
});

test('adapter | indexeddb | select', (assert) => {
  let data = [
    { id: 1, Name: 'A', Surname: 'X', Age: 10 },
    { id: 2, Name: 'A', Surname: 'Y', Age: 11 },
    { id: 3, Name: 'B', Surname: 'Z', Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).select('id,Age,Name');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 3);
    assert.ok(result[0].id);
    assert.ok(result[0].Name);
    assert.ok(result[0].Age);
    assert.notOk(result[0].Surname);
  });
});

test('adapter | indexeddb | order', (assert) => {
  let data = [
    { id: 1, Price: 200, Age: 10 },
    { id: 2, Price: 100, Age: 10 },
    { id: 3, Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).orderBy('Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, 3);
    assert.equal(result[1].id, 2);
    assert.equal(result[2].id, 1);
  });
});

test('adapter | indexeddb | order | master field', (assert) => {
  let data = [
    { id: 1, Price: 200, Creator: { Age: 10 } },
    { id: 2, Price: 100, Creator: { Age: 10 } },
    { id: 3, Price: 900, Creator: { Age: 15 } }
  ];

  let builder = new QueryBuilder(store, modelName).orderBy('Creator.Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, 3);
    assert.equal(result[1].id, 2);
    assert.equal(result[2].id, 1);
  });
});

test('adapter | indexeddb | skip-top', (assert) => {
  const data = [
    { id: 1, Name: 'A', Price: 200, Age: 10 },
    { id: 2, Name: 'B', Price: 100, Age: 10 },
    { id: 3, Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).skip(1).top(1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].Name, 'B');
  });
});

test('adapter | indexeddb | by id', (assert) => {
  let data = [
    { id: 1, Name: 'A', Price: 200, Age: 10 },
    { id: 2, Name: 'B', Price: 100, Age: 10 },
    { id: 3, Name: 'C', Price: 900, Age: 15 }
  ];

  let builder = new QueryBuilder(store, modelName).byId(1);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.equal(result[0].Name, 'A');
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
    new IndexedDbAdapter(dbName).query(store, query).then(checkResult, failQuery);
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
  return db.open().then((db) => db.table(modelName).bulkAdd(data).then(db.close));
}
