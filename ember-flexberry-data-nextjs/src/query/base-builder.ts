/**
 * Базовый класс строителя запросов
 */
export abstract class BaseQueryBuilder {
  /**
   * Строит запрос
   * @param options - Опции запроса
   * @returns Строка запроса
   */
  abstract build(options: any): string;
}
