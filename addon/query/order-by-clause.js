/**
 * Class of order-by part of the query.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class OrderByClause
 */
export default class OrderByClause {
  /**
   * @param clause
   * @class Query.OrderByClause
   * @constructor
   */
  constructor(clause) {
    this._clause = [];
    clause.split(',').forEach((i) => {
      let s = i.trim().split(' ');
      let name, direction = s[s.length - 1];
      if (direction === 'asc' || direction === 'desc') {
        name = s.slice(0, s.length - 1).join(' ');
      } else {
        name = s.slice(0, s.length).join(' ');
        direction = '';
      }
      this._clause.push({ name, direction });
    });
  }

  /**
    Count elements for sorting.

    @attribute length
    @type {Number}
    @public
   */
  get length() {
    return this._clause.length;
  }

  /**
    Returns object with parameters for sorting.

    @method attribute
    @param {Number} index Index element in array.
    @return {Object} Object with parameters for sorting.
   */
  attribute(index) {
    return this._clause[index];
  }
}
