import { expect, test } from '@jest/globals';
import * as index from '../index';

test('Экспорт всех модулей', () => {
  // Проверяем, что все основные модули экспортируются
  expect(index).toHaveProperty('ODataAdapter');
  expect(index).toHaveProperty('IndexedDBAdapter');
  expect(index).toHaveProperty('JSAdapter');
  expect(index).toHaveProperty('BaseAdapter');
  expect(index).toHaveProperty('BaseBuilder');
  expect(index).toHaveProperty('Builder');
  expect(index).toHaveProperty('Condition');
  expect(index).toHaveProperty('FilterOperator');
  expect(index).toHaveProperty('Parameter');
  expect(index).toHaveProperty('Predicate');
  expect(index).toHaveProperty('QueryObject');
  expect(index).toHaveProperty('OrderByClause');

  expect(index).toHaveProperty('BaseStore');
  expect(index).toHaveProperty('LocalStore');
  expect(index).toHaveProperty('OnlineStore');

  expect(index).toHaveProperty('DecimalTransform');
  expect(index).toHaveProperty('FileTransform');
  expect(index).toHaveProperty('FlexberryEnumTransform');
  expect(index).toHaveProperty('GuidTransform');

  expect(index).toHaveProperty('create');
  expect(index).toHaveProperty('getModelInfo');
  expect(index).toHaveProperty('isAsync');
  expect(index).toHaveProperty('isEmbedded');
  expect(index).toHaveProperty('isModelInstance');
  expect(index).toHaveProperty('isObject');
  expect(index).toHaveProperty('getModelFields');
  expect(index).toHaveProperty('hasField');
  expect(index).toHaveProperty('isEmpty');
  expect(index).toHaveProperty('toTitleCase');
});
