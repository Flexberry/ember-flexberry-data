/**
 * Функции для проверки экземпляров моделей
 */

/**
 * Проверяет, является ли объект экземпляром модели
 * @param obj Объект для проверки
 * @returns true если объект экземпляр модели, иначе false
 */
export function isModelInstance(obj: any): boolean {
  // Реализация проверки экземпляра модели
  return obj && typeof obj === 'object' && obj.constructor && obj.constructor.name !== 'Object';
}
