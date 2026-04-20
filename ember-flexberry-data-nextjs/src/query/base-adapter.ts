/**
 * Базовый класс адаптера для работы с запросами
 */
export abstract class BaseAdapter {
  /**
   * Абстрактный метод для получения записи
   * @param url - URL запроса
   * @returns Promise с результатом запроса
   */
  abstract findRecord(url: string): Promise<any>;

  /**
   * Абстрактный метод для создания записи
   * @param url - URL запроса
   * @param data - Данные для отправки
   * @returns Promise с результатом запроса
   */
  abstract createRecord(url: string, data: any): Promise<any>;

  /**
   * Абстрактный метод для обновления записи
   * @param url - URL запроса
   * @param data - Данные для отправки
   * @returns Promise с результатом запроса
   */
  abstract updateRecord(url: string, data: any): Promise<any>;

  /**
   * Абстрактный метод для удаления записи
   * @param url - URL запроса
   * @returns Promise с результатом запроса
   */
  abstract deleteRecord(url: string): Promise<any>;
}
