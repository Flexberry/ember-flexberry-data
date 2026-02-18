/**
 * Функции для проверки встроенных объектов
 */

/**
 * Проверяет, является ли объект встроенным
 * @param obj Объект для проверки
 * @returns true если объект встроенный, иначе false
 */
export function isEmbedded(obj: any): boolean {
  // Реализация проверки встроенности объекта
  return obj && typeof obj === 'object' && obj.isEmbedded === true;
}
