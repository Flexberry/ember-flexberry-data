/**
 * Функция для создания объектов
 * @param modelType Тип модели
 * @param properties Свойства для инициализации
 * @returns Созданный объект
 */
export function create(modelType: string, properties: any = {}): any {
  // Реализация создания объекта
  return {
    ...properties,
    modelType
  };
}
