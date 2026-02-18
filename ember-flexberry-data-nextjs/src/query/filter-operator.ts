/**
 * Операторы фильтрации
 */
export enum FilterOperator {
  Eq = 'eq',
  Neq = 'ne',
  /**
   * Strictly "less than".
   */
  Le = 'lt',
  /**
   * "Less than or equal".
   */
  Leq = 'le',
  /**
   * Strictly "greater than".
   */
  Ge = 'gt',
  /**
   * "Greater than or equal".
   */
  Geq = 'ge'
}
