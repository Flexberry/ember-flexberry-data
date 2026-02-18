/**
 * Генерирует уникальный идентификатор
 * @returns Уникальный идентификатор
 */
export function generateUniqueId(): string {
  // Генерация уникального ID с использованием UUID v4 алгоритма
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
