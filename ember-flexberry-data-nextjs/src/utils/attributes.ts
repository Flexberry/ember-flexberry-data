/**
 * Утилиты для работы с атрибутами моделей
 */

/**
 * Получает список атрибутов модели
 * @param model - Модель
 * @returns Список атрибутов
 */
export function getModelAttributes(model: any): string[] {
  if (!model) {
    return [];
  }

  // В реальной реализации здесь будет логика получения атрибутов модели
  // Для упрощения возвращаем фиктивные атрибуты
  return ['id', 'name', 'description', 'createdAt', 'updatedAt'];
}

/**
 * Проверяет, является ли атрибут системным
 * @param attributeName - Имя атрибута
 * @returns true если атрибут системный, иначе false
 */
export function isSystemAttribute(attributeName: string): boolean {
  const systemAttributes = ['id', 'createdAt', 'updatedAt', 'version'];
  return systemAttributes.includes(attributeName);
}

/**
 * Получает тип атрибута
 * @param model - Модель
 * @param attributeName - Имя атрибута
 * @returns Тип атрибута
 */
export function getAttributeType(model: any, attributeName: string): string {
  // В реальной реализации здесь будет логика получения типа атрибута
  // Для упрощения возвращаем фиктивные типы
  const typeMap: { [key: string]: string } = {
    'id': 'string',
    'name': 'string',
    'description': 'string',
    'createdAt': 'date',
    'updatedAt': 'date',
    'version': 'number'
  };

  return typeMap[attributeName] || 'string';
}

/**
 * Проверяет, является ли атрибут обязательным
 * @param model - Модель
 * @param attributeName - Имя атрибута
 * @returns true если атрибут обязательный, иначе false
 */
export function isRequiredAttribute(model: any, attributeName: string): boolean {
  // В реальной реализации здесь будет логика проверки обязательности атрибута
  // Для упрощения возвращаем фиктивные значения
  const requiredAttributes = ['id', 'name'];
  return requiredAttributes.includes(attributeName);
}
