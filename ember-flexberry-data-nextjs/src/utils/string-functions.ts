/**
 * Функции для работы со строками
 */

/**
 * Проверяет, является ли строка пустой или null/undefined
 * @param str Строка для проверки
 * @returns true если строка пустая, иначе false
 */
export function isEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str === '';
}

/**
 * Приводит строку к формату заглавных букв
 * @param str Строка для преобразования
 * @returns Преобразованная строка
 */
export function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
