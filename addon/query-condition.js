/**
 * Enumeration of logical conditions.
 *
 * @module ember-flexberry-projections
 * @class Condition
 */
export default class Condition { }
Condition.Or = 'or';
Condition.And = 'and';

/**
 * Tries to build condition from specified value.
 *
 * @param value {*} Value with condition.C
 * @returns {Condition}
 */
Condition.tryCreate = function (value) {
  switch (value) {
    case Condition.And:
    case '&&':
      return Condition.And;

    case Condition.Or:
    case '||':
      return Condition.Or;
  }

  throw new Error(`Unknown condition ${value}`);
};
