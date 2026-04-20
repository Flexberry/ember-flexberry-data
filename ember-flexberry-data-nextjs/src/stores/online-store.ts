import { BaseStore } from './base-store';
import { ODataAdapter } from '../adapters/odata';
import { ODataSerializer } from '../serializers/odata';
import { QueryObject } from '../query/query-object';

/**
 * Онлайн хранилище
 */
export class OnlineStore extends BaseStore {
  /**
   * Адаптер для работы с OData
   */
  private adapter: ODataAdapter;

  /**
   * Сериализатор для OData
   */
  private serializer: ODataSerializer;

  /**
   * Конструктор онлайн хранилища
   * @param baseUrl - URL бэкенда
   */
  constructor(baseUrl: string) {
    super();
    this.adapter = new ODataAdapter(baseUrl);
    this.serializer = new ODataSerializer();
  }

  /**
   * Получает запись по ID
   * @param modelName - Название модели
   * @param id - ID записи
   * @returns Запись
   */
  async findRecord(modelName: string, id: string): Promise<any> {
    try {
      const rawData = await this.adapter.findRecord(`${modelName}(${id})`);
      return this.serializer.deserialize(rawData);
    } catch (error) {
      throw new Error(`Ошибка при получении записи ${id} из онлайн хранилища: ${error}`);
    }
  }

  /**
   * Получает все записи модели
   * @param modelName - Название модели
   * @returns Массив записей
   */
  async findAllRecords(modelName: string): Promise<any[]> {
    try {
      const rawData = await this.adapter.findRecord(modelName);
      return rawData.value ? rawData.value.map((item: any) => this.serializer.deserialize(item)) : [];
    } catch (error) {
      throw new Error(`Ошибка при получении всех записей модели ${modelName}: ${error}`);
    }
  }

  /**
   * Выполняет поиск записей по запросу
   * @param modelName - Название модели
   * @param query - Запрос
   * @returns Массив записей
   */
  async findRecords(modelName: string, query?: QueryObject): Promise<any[]> {
    try {
      let url = modelName;

      if (query) {
        // Если есть запрос, добавляем параметры
        const odataQuery = this.adapter.getODataQuery(query.toQuery());
        const queryParams = new URLSearchParams(odataQuery as any);
        url += `?${queryParams.toString()}`;
      }

      const rawData = await this.adapter.findRecord(url);
      return rawData.value ? rawData.value.map((item: any) => this.serializer.deserialize(item)) : [];
    } catch (error) {
      throw new Error(`Ошибка при поиске записей модели ${modelName}: ${error}`);
    }
  }

  /**
   * Создает запись
   * @param modelName - Название модели
   * @param data - Данные записи
   * @returns Созданная запись
   */
  async createRecord(modelName: string, data: any): Promise<any> {
    try {
      const serializedData = this.serializer.serialize(data);
      const result = await this.adapter.createRecord(modelName, serializedData);
      return this.serializer.deserialize(result);
    } catch (error) {
      throw new Error(`Ошибка при создании записи в онлайн хранилище: ${error}`);
    }
  }

  /**
   * Обновляет запись
   * @param modelName - Название модели
   * @param id - ID записи
   * @param data - Данные записи
   * @returns Обновленная запись
   */
  async updateRecord(modelName: string, id: string, data: any): Promise<any> {
    try {
      const serializedData = this.serializer.serialize(data);
      const result = await this.adapter.updateRecord(`${modelName}(${id})`, serializedData);
      return this.serializer.deserialize(result);
    } catch (error) {
      throw new Error(`Ошибка при обновлении записи ${id} в онлайн хранилище: ${error}`);
    }
  }

  /**
   * Удаляет запись
   * @param modelName - Название модели
   * @param id - ID записи
   * @returns Результат удаления
   */
  async deleteRecord(modelName: string, id: string): Promise<any> {
    try {
      return await this.adapter.deleteRecord(`${modelName}(${id})`);
    } catch (error) {
      throw new Error(`Ошибка при удалении записи ${id} из онлайн хранилища: ${error}`);
    }
  }
}
