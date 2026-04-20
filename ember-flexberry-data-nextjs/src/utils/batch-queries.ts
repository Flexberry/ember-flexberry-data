/**
 * Утилиты для работы с пакетными запросами
 */

/**
 * Выполняет пакетный запрос к хранилищу
 * @param queries - Массив запросов
 * @param store - Хранилище
 * @returns Результаты запросов
 */
export async function executeBatchQueries(queries: any[], store: any): Promise<any[]> {
  try {
    const results: any[] = [];

    // Последовательно выполняем все запросы
    for (const query of queries) {
      let result;

      switch (query.operation) {
        case 'find':
          result = await store.findRecord(query.modelName, query.id);
          break;
        case 'create':
          result = await store.createRecord(query.modelName, query.data);
          break;
        case 'update':
          result = await store.updateRecord(query.modelName, query.id, query.data);
          break;
        case 'delete':
          result = await store.deleteRecord(query.modelName, query.id);
          break;
        default:
          throw new Error(`Неизвестная операция: ${query.operation}`);
      }

      results.push({
        query,
        result,
        success: true
      });
    }

    return results;
  } catch (error) {
    console.error('Ошибка при выполнении пакетных запросов:', error);
    throw new Error('Не удалось выполнить пакетные запросы');
  }
}

/**
 * Создает пакетный запрос
 * @param operations - Операции
 * @returns Пакетный запрос
 */
export function createBatchQuery(operations: any[]): any {
  return {
    operations,
    timestamp: new Date().toISOString()
  };
}

/**
 * Проверяет, является ли запрос пакетным
 * @param query - Запрос
 * @returns true если пакетный запрос, иначе false
 */
export function isBatchQuery(query: any): boolean {
  return query && Array.isArray(query.operations);
}

/**
 * Объединяет несколько запросов в один пакетный запрос
 * @param queries - Массив запросов
 * @returns Пакетный запрос
 */
export function combineQueries(...queries: any[]): any {
  const operations = queries.flatMap(query =>
    isBatchQuery(query) ? query.operations : [query]
  );

  return createBatchQuery(operations);
}
