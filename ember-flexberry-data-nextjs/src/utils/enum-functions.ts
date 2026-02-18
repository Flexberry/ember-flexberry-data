/**
 * Функции для работы с перечислениями
 */

/**
 * Получает значение перечисления по ключу
 * @param enumObj Объект перечисления
 * @param key Ключ перечисления
 * @returns Значение перечисления
 */
export function getEnumValue(enumObj: any, key: string): any {
  return enumObj[key];
}

/**
 * Получает ключ перечисления по значению
 * @param enumObj Объект перечисления
 * @param value Значение перечисления
 * @returns Ключ перечисления
 */
export function getEnumKey(enumObj: any, value: any): string | null {
  for (const key in enumObj) {
    if (enumObj[key] === value) {
      return key;
    }
  }
  return null;
}
