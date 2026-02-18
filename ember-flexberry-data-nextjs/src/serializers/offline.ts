import { BaseSerializer } from './base';

/**
 * Offline сериализатор
 */
export class OfflineSerializer extends BaseSerializer {
  /**
   * Сериализует данные для оффлайн-режима
   * @param data - Данные для сериализации
   * @param modelClass - Класс модели для валидации
   * @returns Сериализованные данные
   */
  serialize(data: any, modelClass?: any): any {
    // Если передана модель, выполняем валидацию
    if (modelClass) {
      this.validateModelData(data, modelClass);
    }

    // Для оффлайн-режима добавляем метаданные для отслеживания
    const serializedData = {
      ...data,
      __offline_timestamp__: Date.now(),
      __offline_version__: 1
    };

    // Преобразуем даты в строки для хранения в IndexedDB
    for (const key in serializedData) {
      if (serializedData[key] instanceof Date) {
        serializedData[key] = serializedData[key].toISOString();
      }
    }

    return serializedData;
  }

  /**
   * Десериализует данные из оффлайн-режима
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

    // Удаляем служебные поля
    delete deserializedData.__offline_timestamp__;
    delete deserializedData.__offline_version__;

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
