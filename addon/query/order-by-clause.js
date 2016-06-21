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
      let n = s[0].trim().split('.');
      this._clause.push({
        name: n.length > 1 ? n[1] : s[0],
        master: n.length > 1 ? n[0] : false,
        direction: s[1],
      });
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
