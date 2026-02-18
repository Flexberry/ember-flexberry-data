/**
 * Трансформер для файлов
 */
export class FileTransform {
  /**
   * Преобразует значение в файл
   * @param value - Значение для преобразования
   * @returns Файл
   */
  static serialize(value: any): any {
    // Для файлов обычно ничего не преобразуем, просто возвращаем как есть
    return value;
  }

  /**
   * Преобразует файл в строку
   * @param value - Файл
   * @returns Строковое представление файла
   */
  static deserialize(value: any): string {
    // Для файлов обычно возвращаем строковое представление
    if (value && typeof value === 'object' && value.name) {
      return value.name;
    }
    return String(value);
  }
}
