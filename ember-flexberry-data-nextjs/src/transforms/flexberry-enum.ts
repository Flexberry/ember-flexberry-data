/**
 * Трансформер для перечислений Flexberry
 */
export class FlexberryEnumTransform {
  /**
   * Преобразует значение в перечисление
   * @param value - Значение для преобразования
   * @param enumType - Тип перечисления
   * @returns Значение перечисления
   */
  static serialize(value: any, enumType?: any): any {
    if (value === null || value === undefined) {
      return null;
    }

    // Если передан enumType, проверяем значение
    if (enumType) {
      // Проверяем, существует ли значение в перечислении
      const enumValues = Object.values(enumType);
      if (!enumValues.includes(value)) {
        throw new Error(`Значение "${value}" не существует в перечислении`);
      }
    }

    return value;
  }

  /**
   * Преобразует перечисление в строку
   * @param value - Значение перечисления
   * @returns Строковое представление перечисления
   */
  static deserialize(value: any): string {
    if (value === null || value === undefined) {
      return null;
    }

    // Для перечислений возвращаем строковое представление
    return String(value);
  }
}
