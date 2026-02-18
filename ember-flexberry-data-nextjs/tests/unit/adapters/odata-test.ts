import { module, test } from 'qunit';
import { ODataAdapter } from '../../../src/adapters/odata';
import { SimplePredicate, ComplexPredicate, StringPredicate, DatePredicate } from '../../../src/query/predicate';
import { FilterOperator } from '../../../src/query/filter-operator';

module('Unit | Adapters | OData', function () {
  test('should create adapter correctly', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');
    assert.ok(adapter);
  });

  test('should build OData query with filters', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');

    // Создаем простой предикат
    const predicate = new SimplePredicate('name', FilterOperator.Eq, 'John');

    // Создаем объект запроса
    const query = {
      predicate: predicate,
      modelName: 'User',
      select: ['id', 'name']
    };

    // Проверяем, что метод getODataQuery работает
    const odataQuery = adapter['getODataQuery'](query);
    assert.ok(odataQuery);
  });

  test('should build OData query with complex predicate', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');

    // Создаем сложный предикат
    const predicate1 = new SimplePredicate('name', FilterOperator.Eq, 'John');
    const predicate2 = new SimplePredicate('age', FilterOperator.Geq, 18);
    const complexPredicate = new ComplexPredicate('and', predicate1, predicate2);

    // Создаем объект запроса
    const query = {
      predicate: complexPredicate,
      modelName: 'User',
      select: ['id', 'name', 'age']
    };

    // Проверяем, что метод getODataQuery работает
    const odataQuery = adapter['getODataQuery'](query);
    assert.ok(odataQuery);
  });

  test('should build OData query with string predicate', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');

    // Создаем строковый предикат
    const predicate = new StringPredicate('name').contains('John');

    // Создаем объект запроса
    const query = {
      predicate: predicate,
      modelName: 'User',
      select: ['id', 'name']
    };

    // Проверяем, что метод getODataQuery работает
    const odataQuery = adapter['getODataQuery'](query);
    assert.ok(odataQuery);
  });

  test('should build OData query with date predicate', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');

    // Создаем предикат даты
    const date = new Date('2023-01-01');
    const predicate = new DatePredicate('createdDate', FilterOperator.Eq, date);

    // Создаем объект запроса
    const query = {
      predicate: predicate,
      modelName: 'User',
      select: ['id', 'createdDate']
    };

    // Проверяем, что метод getODataQuery работает
    const odataQuery = adapter['getODataQuery'](query);
    assert.ok(odataQuery);
  });

  test('should build full OData URL', function (assert) {
    const adapter = new ODataAdapter('http://localhost:8080/odata');

    // Создаем объект запроса
    const query = {
      predicate: new SimplePredicate('name', FilterOperator.Eq, 'John'),
      modelName: 'User',
      select: ['id', 'name'],
      top: 10,
      skip: 5
    };

    // Проверяем, что метод getODataFullUrl работает
    const fullUrl = adapter.getODataFullUrl(query);
    assert.ok(fullUrl);
    assert.ok(fullUrl.includes('http://localhost:8080/odata'));
    assert.ok(fullUrl.includes('$filter'));
    assert.ok(fullUrl.includes('$top=10'));
    assert.ok(fullUrl.includes('$skip=5'));
  });
});
