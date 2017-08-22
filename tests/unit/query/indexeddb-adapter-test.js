import Dexie from 'npm:dexie';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import IndexedDbAdapter from 'ember-flexberry-data/query/indexeddb-adapter';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from 'ember-flexberry-data/query/predicate';
import Condition from 'ember-flexberry-data/query/condition';

import startApp from '../../helpers/start-app';

const appIndexedbAdapterTest = startApp();
const storeIndexedbAdapterTest = appIndexedbAdapterTest.__container__.lookup('service:store');
const dexieIndexedbAdapterTest = appIndexedbAdapterTest.__container__.lookup('service:dexie');
const offlineGlobalsIndexedbAdapterTest = appIndexedbAdapterTest.__container__.lookup('service:offline-globals');
offlineGlobalsIndexedbAdapterTest.setOnlineAvailable(false);
const databasePrefixIndexedbAdapterTest = 'testDBIAT';
const modelNameIndexedbAdapterTest = 'employee';
const schemaIndexedbAdapterTest = (dbName) => {
  let object = {};
  object[dbName] = {
    1: {
      employee: 'id,Age,Name,Surname,CountryName,Price,Active,Country,Creator,Manager,*Tags',
      creator: 'id,Name,Age,Country',
      man: 'id,Name,Age,Country,EyesColor',
      bot: 'id,Name,Age,Country,IsClever',
      country: 'id,Name',
      tag: 'id,Name,Creator'
    },
  };
  return object;
};

module('indexeddb-adapter-test query');

test('adapter | indexeddb | without predicate', (assert) => {
  let data = {
    employee: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ],
  };

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Name', FilterOperator.Eq, 'B');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Name', FilterOperator.Eq, null);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Manager', FilterOperator.Eq, 3);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Manager.Name', FilterOperator.Eq, 'Y');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Name', FilterOperator.Neq, 'B');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Age', FilterOperator.Le, 12);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Age', FilterOperator.Leq, 11);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Age', FilterOperator.Ge, 10);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where('Age', FilterOperator.Geq, 11);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(sp1);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(sp1);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).where(dp);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Surname').where(cp1);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Surname').where(cp1);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Surname').where(cp2);

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
  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Surname').where(cp2);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('id,Age,Name');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).orderBy('Age desc, Price asc');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).orderBy('Price asc').skip(1).top(2);

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0].id, 1);
    assert.equal(result.data[1].id, 3);
  });
});

test('adapter | indexeddb | polymorphic relationships', (assert) => {
  let data = {
    employee: [
      { id: 1, Creator: 1, Tags: [5, 3], _Creator_type: 'bot' },
      { id: 2, Creator: 3, Tags: [3, 1], _Creator_type: 'man' },
      { id: 3, Creator: 5, Tags: [2, 4], _Creator_type: 'creator' },
    ],
    creator: [
      { id: 1, Name: 'X' },
      { id: 2, Name: 'Y' },
      { id: 3, Name: 'Z' },
      { id: 4, Name: 'A' },
      { id: 5, Name: 'M' },
    ],
    bot: [
      { id: 1, Name: 'X', IsClever: true },
      { id: 4, Name: 'A', IsClever: false },
      { id: 5, Name: 'M', IsClever: true },
    ],
    man: [
      { id: 2, Name: 'Y', EyesColor: 'gray' },
      { id: 3, Name: 'Z', EyesColor: 'blue' },
    ],
    tag: [
      { id: 1, Creator: 1, _Creator_type: 'bot' },
      { id: 2, Creator: 2, _Creator_type: 'man' },
      { id: 3, Creator: 3, _Creator_type: 'man' },
      { id: 4, Creator: 4, _Creator_type: 'bot' },
      { id: 5, Creator: 5, _Creator_type: 'bot' },
    ],
  };

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).selectByProjection('TestJoins').orderBy('id asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.equal(result.data[0]._Creator_type, 'bot');
    assert.equal(result.data[1]._Creator_type, 'man');
    assert.equal(result.data[2]._Creator_type, 'creator');
    assert.ok(!!result.data[0].Tags[0]._Creator_type);
  });
});

module('indexeddb-adapter-test performance');

test('adapter | indexeddb | no filter, no order, no skip, no top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('id,Price,Name');

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 15000, 'Loading 15000 objects');
  });
});

test('adapter | indexeddb | no filter, order asc, skip, top', (assert) => {
  let data = getPerformanceTestData(15000, assert);

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

module('indexeddb-adapter-test joins performance');

test('adapter | indexeddb | joins, no filter, many order asc desc, skip, top', (assert) => {
  let count = 5000;
  let data = getJoinsPerformanceTestData(count, assert);

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
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

test('adapter | indexeddb | by id with joins without select', (assert) => {
  let count = 5000;
  let data = getJoinsPerformanceTestData(count, assert);

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
    .byId(3);

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 1, 'Loading 1 object');
    assert.equal(result.data[0].id, 3, 'Check id');
    assert.notOk(result.data[0].Name, 'Check own property');
    assert.notOk(result.data[0].Creator, 'Check master property');
    assert.notOk(result.data[0].Country, 'Check master id');
  });
});

test('adapter | indexeddb | by id with joins select', (assert) => {
  let count = 5000;
  let data = getJoinsPerformanceTestData(count, assert);

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
    .select('id,Name,Creator.Age,Creator.Country.Name,Country,Country.id,Tags.Name')
    .byId(3);

  executeTest(data, builder.build(), assert, (result, startExecTime) => {
    let endExecTime = window.performance.now();
    assert.ok(true, `${Math.round(endExecTime - startExecTime)} ms execution time, loaded ${result.data.length}`);
    assert.ok(result.data, 'Data exists');
    assert.equal(result.data.length, 1, 'Loading 1 object');
    assert.equal(result.data[0].id, 3, 'Check id');
    assert.equal(result.data[0].Name, 'George', 'Check own property');
    assert.equal(result.data[0].Creator.Age, 15, 'Check master property');
    assert.equal(result.data[0].Creator.Country.Name, 'Austria', 'Check master.master property');
    assert.equal(result.data[0].Country.id, 3, 'Check master id');
    assert.equal(result.data[0].Tags.length, 3, 'Check details count');
    assert.equal(result.data[0].Tags[0].Name, 'TTT', 'Check detail value');
    assert.notOk(result.data[0].Age, 'Check redundant own property');
    assert.notOk(result.data[0].Country.Name, 'Check redundant master property');
    assert.notOk(result.data[0].Tags[0].Creator, 'Check redundant detail property');
  });
});

module('performance query masters');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).orderBy('Creator.Age desc, Price asc');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data);
    assert.equal(result.data.length, 3);
    assert.equal(result.data[0].id, 3);
    assert.equal(result.data[1].id, 2);
    assert.equal(result.data[2].id, 1);
  });
});

test('adapter | indexeddb | select master.master.field and order', (assert) => {
  let data = {
    employee: [
      { id: 1, Price: 200, Creator: 1 },
      { id: 2, Price: 100, Creator: 1 },
      { id: 3, Price: 900, Creator: 2 },
    ],
    creator: [
      { id: 1, Age: 10, Country: 1 },
      { id: 2, Age: 15, Country: 2 },
    ],
    country: [
      { id: 1, Name: 'Austria' },
      { id: 2, Name: 'Australia' },
    ]
  };

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest)
    .orderBy('Creator.Age desc, Price asc')
    .select('id,Creator,Creator.Age,Creator.Country.Name');

  executeTest(data, builder.build(), assert, (result) => {
    assert.ok(result.data, 'Data exist');
    assert.equal(result.data.length, 3, 'Loaded all objects');
    assert.equal(result.data[0].id, 3, 'Ordering 1');
    assert.equal(result.data[1].id, 2, 'Ordering 2');
    assert.equal(result.data[2].id, 1, 'Ordering 3');
    assert.equal(result.data[0].Creator.Country.Name, 'Australia', 'Data exist');

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Name').count().skip(1).top(1);

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

  let builder = new QueryBuilder(storeIndexedbAdapterTest, modelNameIndexedbAdapterTest).select('Name').byId(1);

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
  let dbName = databasePrefixIndexedbAdapterTest + Math.random();

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
    storeIndexedbAdapterTest.set('offlineSchema', schemaIndexedbAdapterTest(dbName));
    let db = dexieIndexedbAdapterTest.dexie(dbName, storeIndexedbAdapterTest);
    db.open().then((db) => {
      let startExecTime = window.performance.now();
      new IndexedDbAdapter(db).query(storeIndexedbAdapterTest, query).then((result) => {
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
  storeIndexedbAdapterTest.set('offlineSchema', schemaIndexedbAdapterTest(dbName));
  let db = dexieIndexedbAdapterTest.dexie(dbName, storeIndexedbAdapterTest);
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
      { id: 1, Price: 200, Age: 10, Name: 'Felix', Creator: 1, Country: 1, Tags: [1, 2, 3] },
      { id: 2, Price: 100, Age: 10, Name: 'Edward', Creator: 1, Country: 1, Tags: [1, 2, 3] },
      { id: 3, Price: 900, Age: 15, Name: 'George', Creator: 2, Country: 3, Tags: [1, 2, 3] }
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
    ],
    tag: [
      { id: 1, Name: 'TTT', Creator: 1 },
      { id: 2, Name: 'AAA', Creator: 2 },
      { id: 3, Name: 'GGG', Creator: 3 },
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
      Country: Math.floor(Math.random() * 9) > 3 ? Math.floor(Math.random() * count) : null,
      Tags: []
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
