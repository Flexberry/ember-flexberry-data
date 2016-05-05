/**
 * Class of order-by part of the query.
 *
 * @module ember-flexberry-projections
 * @class OrderByClause
 */
export default class OrderByClause {
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

  get length() {
    return this._clause.length;
  }

  property(index) {
    return this._clause[index];
  }
}
