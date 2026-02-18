/**
 * Функции для проверки объектов
 */

/**
 * Проверяет, является ли значение объектом
 * @param value Значение для проверки
 * @returns true если значение объект, иначе false
 */
export function isObject(value: any): boolean {
  // Реализация проверки объекта
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
