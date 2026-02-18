/**
 * Функции для проверки асинхронности
 */

/**
 * Проверяет, является ли значение асинхронным
 * @param value Значение для проверки
 * @returns true если значение асинхронное, иначе false
 */
export function isAsync(value: any): boolean {
  // Реализация проверки асинхронности
  return value instanceof Promise || (value !== null && typeof value === 'object' && typeof value.then === 'function');
}
