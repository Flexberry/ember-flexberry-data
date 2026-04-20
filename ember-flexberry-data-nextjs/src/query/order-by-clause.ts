/**
 * Класс для представления clause сортировки
 */
export class OrderByClause {
  /**
   * Поле для сортировки
   */
  field: string;

  /**
   * Направление сортировки (asc или desc)
   */
  direction: 'asc' | 'desc';

  /**
   * Конструктор clause сортировки
   * @param field Поле для сортировки
   * @param direction Направление сортировки
   */
  constructor(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.field = field;
    this.direction = direction;
  }
}
