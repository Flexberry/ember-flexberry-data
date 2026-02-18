/**
 * Базовый класс хранилища
 */
export abstract class BaseStore {
  /**
   * Получает запись по ID
   * @param modelName - Название модели
   * @param id - ID записи
   * @returns Запись
   */
  abstract findRecord(modelName: string, id: string): Promise<any>;

  /**
   * Создает запись
   * @param modelName - Название модели
   * @param data - Данные записи
   * @returns Созданная запись
   */
  abstract createRecord(modelName: string, data: any): Promise<any>;

  /**
   * Обновляет запись
   * @param modelName - Название модели
   * @param id - ID записи
   * @param data - Данные записи
   * @returns Обновленная запись
   */
  abstract updateRecord(modelName: string, id: string, data: any): Promise<any>;

  /**
   * Удаляет запись
   * @param modelName - Название модели
   * @param id - ID записи
   * @returns Результат удаления
   */
  abstract deleteRecord(modelName: string, id: string): Promise<any>;
}
