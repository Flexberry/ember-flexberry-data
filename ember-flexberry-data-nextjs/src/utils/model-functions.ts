/**
 * Функции для работы с моделями
 */

/**
 * Получает все поля модели
 * @param model Модель данных
 * @returns Массив полей модели
 */
export function getModelFields(model: any): string[] {
  // Реализация получения полей модели
  return Object.keys(model);
}

/**
 * Проверяет наличие поля у модели
 * @param model Модель данных
 * @param fieldName Имя поля
 * @returns true если поле существует, иначе false
 */
export function hasField(model: any, fieldName: string): boolean {
  // Реализация проверки наличия поля
  return Object.prototype.hasOwnProperty.call(model, fieldName);
}
