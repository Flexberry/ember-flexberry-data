import { BaseStore } from './base-store';
import { OfflineAdapter } from '../adapters/offline';
import { OfflineSerializer } from '../serializers/offline';
import { QueryObject } from '../query/query-object';
import { SimplePredicate, ComplexPredicate, StringPredicate, BasePredicate } from '../query/predicate';

/**
 * Локальное хранилище
 */
export class LocalStore extends BaseStore {
  /**
   * Адаптер для работы с IndexedDB
   */
  private adapter: OfflineAdapter;

  /**
   * Сериализатор для оффлайн-режима
   */
  private serializer: OfflineSerializer;

  /**
   * Конструктор локального хранилища
   * @param dbName - Имя базы данных
   * @param dbVersion - Версия базы данных
   */
  constructor(dbName: string, dbVersion: number = 1) {
    super();
    this.adapter = new OfflineAdapter(dbName, dbVersion);
    this.serializer = new OfflineSerializer();
  }

  /**
   * Получает запись по ID
   * @param modelName - Название модели
   * @param id - ID записи
   * @returns Запись
   */
  async findRecord(modelName: string, id: string): Promise<any> {
    try {
      const rawData = await this.adapter.findRecordById(modelName, id);
      return rawData ? this.serializer.deserialize(rawData) : null;
    } catch (error) {
      throw new Error(`Ошибка при получении записи ${id} из локального хранилища: ${error}`);
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
      return rawData.map((item: any) => this.serializer.deserialize(item));
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
      let rawData: any[] = [];

      if (query) {
        // Если есть запрос, применяем его
        const queryData = query.toQuery();
        rawData = await this.adapter.findRecord(modelName);

        // Применяем фильтрацию
        if (queryData.predicate) {
          rawData = this.applyPredicateFilter(rawData, queryData.predicate);
        }
      } else {
        // Если нет запроса, получаем все записи
        rawData = await this.adapter.findRecord(modelName);
      }

      return rawData.map((item: any) => this.serializer.deserialize(item));
    } catch (error) {
      throw new Error(`Ошибка при поиске записей модели ${modelName}: ${error}`);
    }
  }

  /**
   * Применяет предикат к данным
   * @param data - Данные
   * @param predicate - Предикат
   * @returns Отфильтрованные данные
   */
  private applyPredicateFilter(data: any[], predicate: BasePredicate): any[] {
    return data.filter((item) => this.matchesPredicate(item, predicate));
  }

  /**
   * Проверяет, удовлетворяет ли запись предикату
   * Поддерживаются:
   * - SimplePredicate (Eq, Neq, Ge, Gt, Le, Lt)
   * - StringPredicate (contains, регистронезависимо)
   * - ComplexPredicate (AND/OR)
   */
  private matchesPredicate(record: any, predicate: BasePredicate): boolean {
    if (predicate instanceof SimplePredicate) {
      const { attributePath, operator, value } = predicate;
      const actual = this.getByPath(record, attributePath);

      switch (operator) {
        case 'eq':
        case '==':
          return actual === value;
        case 'ne':
        case 'neq':
        case '!=':
          return actual !== value;
        case 'gt':
        case 'ge':
        case 'lt':
        case 'le':
          if (actual == null || value == null) {
            return false;
          }
          // Приводим к числу/дате, если это возможно
          const left = this.normalizeComparable(actual);
          const right = this.normalizeComparable(value);
          switch (operator) {
            case 'gt':
              return left > right;
            case 'ge':
              return left >= right;
            case 'lt':
              return left < right;
            case 'le':
              return left <= right;
            default:
              return false;
          }
        default:
          return false;
      }
    }

    if (predicate instanceof StringPredicate) {
      const { attributePath, containsValue } = predicate;
      const actual = this.getByPath(record, attributePath);

      if (actual == null) {
        return false;
      }

      const haystack = String(actual).toLowerCase();
      const needle = String(containsValue || '').toLowerCase();

      if (!needle) {
        return true;
      }

      return haystack.includes(needle);
    }

    if (predicate instanceof ComplexPredicate) {
      const { condition, predicates } = predicate;
      if (!predicates || predicates.length === 0) {
        return true;
      }

      if (condition.toUpperCase() === 'AND') {
        return predicates.every((p) => this.matchesPredicate(record, p));
      }

      if (condition.toUpperCase() === 'OR') {
        return predicates.some((p) => this.matchesPredicate(record, p));
      }

      return false;
    }

    // Для неподдерживаемых предикатов по умолчанию отдаём true,
    // чтобы они не исключали записи неожиданно.
    return true;
  }

  /**
   * Безопасно получает вложенное свойство по пути вида "a.b.c".
   */
  private getByPath(obj: any, path: string): any {
    if (!path) {
      return undefined;
    }

    return path.split('.').reduce((acc: any, key: string) => {
      if (acc == null) {
        return undefined;
      }

      return acc[key];
    }, obj);
  }

  /**
   * Нормализует значение для сравнения: дата, число или исходное значение.
   */
  private normalizeComparable(value: any): any {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'string') {
      const asNumber = Number(value);
      if (!Number.isNaN(asNumber)) {
        return asNumber;
      }

      const asDate = Date.parse(value);
      if (!Number.isNaN(asDate)) {
        return asDate;
      }
    }

    return value;
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
      throw new Error(`Ошибка при создании записи в локальном хранилище: ${error}`);
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
      // Гарантируем, что идентификатор присутствует в данных,
      // чтобы IndexedDB могла корректно обновить запись по ключу.
      const withId = data && data.id == null ? { ...data, id } : data;
      const serializedData = this.serializer.serialize(withId);
      const result = await this.adapter.updateRecord(modelName, serializedData);
      return this.serializer.deserialize(result);
    } catch (error) {
      throw new Error(`Ошибка при обновлении записи ${id} в локальном хранилище: ${error}`);
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
      return await this.adapter.deleteRecordById(modelName, id);
    } catch (error) {
      throw new Error(`Ошибка при удалении записи ${id} из локального хранилища: ${error}`);
    }
  }

  /**
   * Удаляет все записи модели
   * @param modelName - Название модели
   * @returns Результат удаления
   */
  async deleteAllRecords(modelName: string): Promise<any> {
    try {
      return await this.adapter.deleteRecord(modelName);
    } catch (error) {
      throw new Error(`Ошибка при удалении всех записей модели ${modelName}: ${error}`);
    }
  }
}
