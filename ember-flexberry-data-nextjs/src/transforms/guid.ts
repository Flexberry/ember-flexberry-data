/**
 * Трансформер для GUID
 */
export class GuidTransform {
  /**
   * Преобразует значение в GUID
   * @param value - Значение для преобразования
   * @returns GUID
   */
  static serialize(value: any): string {
    if (value === null || value === undefined) {
      return null;
    }

    // Если уже GUID, возвращаем как есть
    if (typeof value === 'string' && this.isValidGuid(value)) {
      return value;
    }

    // Генерируем новый GUID если нужно
    return this.generateGuid();
  }

  /**
   * Преобразует GUID в строку
   * @param value - GUID
   * @returns Строковое представление GUID
   */
  static deserialize(value: string): string {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  }

  /**
   * Проверяет, является ли строка действительным GUID
   * @param guid - Строка для проверки
   * @returns true если строка является GUID
   */
  private static isValidGuid(guid: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  }

  /**
   * Генерирует новый GUID
   * @returns Новый GUID
   */
  private static generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
