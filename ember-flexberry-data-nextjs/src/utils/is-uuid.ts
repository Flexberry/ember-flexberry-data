/**
 * Проверяет, является ли строка UUID
 * @param str - Строка для проверки
 * @returns true если строка является UUID, иначе false
 */
export function isUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
