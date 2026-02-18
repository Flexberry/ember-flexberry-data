/**
 * Трансформер для десятичных чисел
 */
export class DecimalTransform {
  /**
   * Преобразует значение в десятичное число
   * @param value - Значение для преобразования
   * @returns Десятичное число
   */
  static serialize(value: any): number {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      // Проверяем, является ли строка числом
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        throw new Error(`Невозможно преобразовать строку "${value}" в число`);
      }
      return numValue;
    }

    if (typeof value === 'number') {
      return value;
    }

    // Для других типов пытаемся преобразовать
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Невозможно преобразовать значение "${value}" в число`);
    }
    return numValue;
  }

  /**
   * Преобразует десятичное число в строку
   * @param value - Десятичное число
   * @returns Строковое представление числа
   */
  static deserialize(value: number): string {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toString();
  }
}
