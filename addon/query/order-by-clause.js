/**
 * Class of order-by part of the query.
 *
 * @module ember-flexberry-projections
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
    clause.split(',').forEach(i => {
      let s = i.trim().split(' ');
      this._clause.push({
        name: s[0],
        direction: s[1]
      });
    });
  }

  /**
   * @attribute length
   * @type {Number}
   * @public
   */
  get length() {
    return this._clause.length;
  }

  /**
   * @method property
   * @param {Number} index
   * @return {Object}
   */
  attribute(index) {
    return this._clause[index];
  }
}
