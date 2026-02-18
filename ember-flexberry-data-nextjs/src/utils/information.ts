/**
 * Функции для получения информации о данных
 */

/**
 * Получает информацию о модели
 * @param model Модель данных
 * @returns Информация о модели
 */
export function getModelInfo(model: any): any {
  // Реализация получения информации о модели
  return {
    modelName: model.constructor.name,
    attributes: Object.keys(model),
  };
}
