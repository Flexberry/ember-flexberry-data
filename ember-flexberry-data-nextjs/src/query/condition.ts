/**
 * Условие для фильтрации данных
 */
export class Condition {
  /**
   * Поле для фильтрации
   */
  field: string;

  /**
   * Оператор фильтрации
   */
  operator: string;

  /**
   * Значение для фильтрации
   */
  value: any;

  /**
   * Конструктор условия
   * @param field Поле для фильтрации
   * @param operator Оператор фильтрации
   * @param value Значение для фильтрации
   */
  constructor(field: string, operator: string, value: any) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
}
