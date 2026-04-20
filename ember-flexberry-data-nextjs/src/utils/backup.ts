/**
 * Утилиты для работы с резервными копиями данных
 */

/**
 * Создает резервную копию данных
 * @param data - Данные для резервного копирования
 * @returns Резервная копия данных
 */
export function createBackup(data: any): any {
  try {
    // Создаем глубокую копию данных
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка при создании резервной копии:', error);
    throw new Error('Не удалось создать резервную копию данных');
  }
}

/**
 * Восстанавливает данные из резервной копии
 * @param backup - Резервная копия данных
 * @returns Восстановленные данные
 */
export function restoreFromBackup(backup: any): any {
  try {
    // Восстанавливаем данные из резервной копии
    return JSON.parse(JSON.stringify(backup));
  } catch (error) {
    console.error('Ошибка при восстановлении из резервной копии:', error);
    throw new Error('Не удалось восстановить данные из резервной копии');
  }
}

/**
 * Сравнивает две версии данных
 * @param oldData - Старые данные
 * @param newData - Новые данные
 * @returns Различия между данными
 */
export function compareData(oldData: any, newData: any): any {
  // В реальной реализации здесь будет сравнение данных
  // Для упрощения возвращаем фиктивные данные

  const differences: any = {};

  // Простая проверка на различие
  if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
    differences.changed = true;
    differences.old = oldData;
    differences.new = newData;
  } else {
    differences.changed = false;
  }

  return differences;
}

/**
 * Создает резервную копию для конкретной модели
 * @param modelName - Название модели
 * @param data - Данные модели
 * @returns Резервная копия модели
 */
export function createModelBackup(modelName: string, data: any): any {
  return {
    modelName,
    data: createBackup(data),
    timestamp: new Date().toISOString()
  };
}
