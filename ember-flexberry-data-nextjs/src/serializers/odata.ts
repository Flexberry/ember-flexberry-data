import { BaseSerializer } from './base';

/**
 * OData сериализатор
 */
export class ODataSerializer extends BaseSerializer {
  /**
   * Сериализует данные в формат OData
   * @param data - Данные для сериализации
   * @param modelClass - Класс модели для валидации
   * @returns Сериализованные данные
   */
  serialize(data: any, modelClass?: any): any {
    // Если передана модель, выполняем валидацию
    if (modelClass) {
      // Простая валидация данных
      this.validateModelData(data, modelClass);
    }

    // Преобразуем даты в формат OData
    const serializedData = { ...data };
    for (const key in serializedData) {
      if (serializedData[key] instanceof Date) {
        serializedData[key] = serializedData[key].toISOString();
      }
    }

    return serializedData;
  }

  /**
   * Десериализует данные из формата OData
   * @param data - Данные для десериализации
   * @param modelClass - Класс модели для валидации
   * @returns Десериализованные данные
   */
  deserialize(data: any, modelClass?: any): any {
    // Если передана модель, выполняем валидацию
    if (modelClass) {
      this.validateModelData(data, modelClass);
    }

    // Преобразуем строки дат в объекты Date
    const deserializedData = { ...data };
    for (const key in deserializedData) {
      if (typeof deserializedData[key] === 'string' && this.isDate(deserializedData[key])) {
        deserializedData[key] = new Date(deserializedData[key]);
      }
    }

    return deserializedData;
  }

  /**
   * Проверяет, является ли строка датой
   * @param str - Строка для проверки
   * @returns true если строка является датой
   */
  private isDate(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(str);
  }

  /**
   * Валидирует данные модели
   * @param data - Данные для валидации
   * @param modelClass - Класс модели
   */
  private validateModelData(data: any, modelClass: any): void {
    // Здесь должна быть реализация валидации данных согласно модели
    // Для упрощения оставим заглушку
    if (!data) {
      throw new Error('Данные не могут быть пустыми');
    }
  }
}
