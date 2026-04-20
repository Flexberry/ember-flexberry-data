/**
 * Базовый класс сериализатора
 */
export abstract class BaseSerializer {
  /**
   * Сериализует данные
   * @param data - Данные для сериализации
   * @returns Сериализованные данные
   */
  abstract serialize(data: any): any;

  /**
   * Десериализует данные
   * @param data - Данные для десериализации
   * @returns Десериализованные данные
   */
  abstract deserialize(data: any): any;
}
