/**
 * Enumeration of logical conditions for {{#crossLink "Query.ComplexPredicate"}}{{/crossLink}}.
 *
 * @module ember-flexberry-projections
 * @namespace Query
 * @class Condition
 */
export default class Condition { }

/**
 * OR logical condition.
 *
 * @property Or
 * @for Query.Condition
 * @type Query.Condition
 * @static
 * @final
 */
Condition.Or = 'or';

/**
 * AND logical condition.
 *
 * @property And
 * @for Query.Condition
 * @type Query.Condition
 * @static
 * @final
 */
Condition.And = 'and';

/**
 * Tries to build condition from specified value.
 *
 * @method tryCreate
 * @for Query.Condition
 * @param value {String} Value with condition.
 * @return {Query.Condition} Condition from the value.
 * @static
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
