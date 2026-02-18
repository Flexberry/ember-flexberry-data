import {
  getModelAttributes,
  isSystemAttribute,
  getAttributeType,
  isRequiredAttribute,
  createBackup,
  restoreFromBackup,
  compareData,
  createModelBackup,
  executeBatchQueries,
  createBatchQuery,
  isBatchQuery,
  combineQueries
} from '../utils';

describe('Утилиты работы с атрибутами', () => {
  test('должен получать атрибуты модели', () => {
    const model = { name: 'TestModel' };
    const attributes = getModelAttributes(model);

    expect(Array.isArray(attributes)).toBe(true);
    expect(attributes.length).toBeGreaterThan(0);
  });

  test('должен проверять системные атрибуты', () => {
    expect(isSystemAttribute('id')).toBe(true);
    expect(isSystemAttribute('name')).toBe(false);
  });

  test('должен получать тип атрибута', () => {
    expect(getAttributeType({}, 'id')).toBe('string');
    expect(getAttributeType({}, 'name')).toBe('string');
    expect(getAttributeType({}, 'createdAt')).toBe('date');
  });

  test('должен проверять обязательные атрибуты', () => {
    expect(isRequiredAttribute({}, 'id')).toBe(true);
    expect(isRequiredAttribute({}, 'name')).toBe(true);
    expect(isRequiredAttribute({}, 'description')).toBe(false);
  });
});

describe('Утилиты резервного копирования', () => {
  test('должен создавать резервную копию', () => {
    const data = { id: 1, name: 'Test' };
    const backup = createBackup(data);

    expect(backup).toEqual(data);
    expect(backup).not.toBe(data); // должен быть глубокой копией
  });

  test('должен восстанавливать из резервной копии', () => {
    const data = { id: 1, name: 'Test' };
    const backup = createBackup(data);
    const restored = restoreFromBackup(backup);

    expect(restored).toEqual(data);
  });

  test('должен сравнивать данные', () => {
    const oldData = { id: 1, name: 'Test' };
    const newData = { id: 1, name: 'Test' };
    const differences = compareData(oldData, newData);

    expect(differences.changed).toBe(false);
  });

  test('должен создавать резервную копию модели', () => {
    const data = { id: 1, name: 'Test' };
    const backup = createModelBackup('TestModel', data);

    expect(backup.modelName).toBe('TestModel');
    expect(backup.data).toEqual(data);
    expect(backup.timestamp).toBeDefined();
  });
});

describe('Утилиты пакетных запросов', () => {
  test('должен создавать пакетный запрос', () => {
    const operations = [
      { operation: 'find', modelName: 'users', id: '1' }
    ];
    const batchQuery = createBatchQuery(operations);

    expect(batchQuery.operations).toEqual(operations);
    expect(batchQuery.timestamp).toBeDefined();
  });

  test('должен проверять пакетный запрос', () => {
    const operations = [
      { operation: 'find', modelName: 'users', id: '1' }
    ];
    const batchQuery = createBatchQuery(operations);

    expect(isBatchQuery(batchQuery)).toBe(true);
    expect(isBatchQuery({})).toBe(false);
  });

  test('должен объединять запросы', () => {
    const query1 = { operation: 'find', modelName: 'users', id: '1' };
    const query2 = { operation: 'create', modelName: 'users', data: { name: 'Test' } };

    const combined = combineQueries(query1, query2);

    expect(combined.operations.length).toBe(2);
  });
});
