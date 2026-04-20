/**
 * Базовая модель данных
 */
export class BaseModel {
  /**
   * Идентификатор записи
   */
  id?: string;

  /**
   * Конструктор модели
   * @param attributes - Атрибуты модели
   */
  constructor(attributes?: any) {
    if (attributes) {
      Object.assign(this, attributes);
    }
  }

  /**
   * Получает атрибуты модели
   * @returns Атрибуты модели
   */
  getAttributes(): any {
    const attributes: any = {};
    for (const key in this) {
      if (this.hasOwnProperty(key) && key !== 'id') {
        attributes[key] = this[key];
      }
    }
    return attributes;
  }

  /**
   * Устанавливает атрибуты модели
   * @param attributes - Атрибуты для установки
   */
  setAttributes(attributes: any): void {
    Object.assign(this, attributes);
  }
}
