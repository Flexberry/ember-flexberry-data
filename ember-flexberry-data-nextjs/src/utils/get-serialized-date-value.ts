/**
 * Функция для получения сериализованного значения даты
 * @param date Дата для сериализации
 * @returns Сериализованное значение даты
 */
export function getSerializedDateValue(date: Date): string {
  // Реализация сериализации даты
  return date.toISOString();
}
