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
    this._masterClause = [];
    clause.split(',').forEach((i) => {
      let s = i.trim().split(' ');
      let n = s[0].trim().split('.');
      if (n.length > 1) {
        this._masterClause[n[0].trim()] = this._masterClause[n[0].trim()] ? this._masterClause[n[0].trim()] : [];
        this._masterClause[n[0].trim()].push({
          name: n[1],
          direction: s[1],
        });
      } else {
        this._clause.push({
          name: s[0],
          direction: s[1],
        });
      }
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

  /**
    Returns count elements for sorting.

    @method masterLength
    @param {String} master Name master object.
    @return {Number} Count elements for sorting.
   */
  masterLength(master) {
    if (this._masterClause[master]) {
      return this._masterClause[master].length;
    }

    return 0;
  }

  /**
    Returns object with parameters for sorting, for specified master object.

    @method masterAttribute
    @param {String} master Name master object.
    @param {Number} index Index element in array.
    @return {Object} Object with parameters for sorting.
   */
  masterAttribute(master, index) {
    return this._masterClause[master][index];
  }
}
