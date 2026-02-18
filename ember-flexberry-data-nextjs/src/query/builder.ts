import { BaseQueryBuilder } from './base-builder';

/**
 * Класс строителя запросов
 */
export class QueryBuilder extends BaseQueryBuilder {
  /**
   * Строит запрос
   * @param options - Опции запроса
   * @returns Строка запроса
   */
  build(options: any): string {
    // Реализация построения запроса
    // В данном примере просто возвращаем строку с опциями
    return JSON.stringify(options);
  }
}
