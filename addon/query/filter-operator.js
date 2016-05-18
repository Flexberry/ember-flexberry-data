/**
 * Enumeration of operators for filtering data for {{#crossLink "Query.SimplePredicate"}}{{/crossLink}}.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class FilterOperator
 */
export default class FilterOperator { }

/**
 * Operator for equality.
 *
 * @property Eq
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Eq = 'eq';

/**
 * Operator for inequality.
 *
 * @property Neq
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Neq = 'neq';

/**
 * Operator for _greater_.
 *
 * @property Ge
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Ge = 'ge';

/**
 * Operator for _greater or equal_.
 *
 * @property Ge
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Geq = 'geq';

/**
 * Operator for _less_.
 *
 * @property Le
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Le = 'le';

/**
 * Operator for _less or equal_.
 *
 * @property Le
 * @for Query.FilterOperator
 * @type Query.FilterOperator
 * @static
 * @final
 */
FilterOperator.Leq = 'leq';

/**
 * Tries to build filter operator from specified value.
 *
 * @method tryCreate
 * @for Query.FilterOperator
 * @param value {String} Value with filter operator.
 * @return {Query.FilterOperator} Filter operator from the value.
 * @static
 */
FilterOperator.tryCreate = function (value) {
  switch (value) {
    case FilterOperator.Eq:
    case '==':
      return FilterOperator.Eq;

    case FilterOperator.Neq:
    case '<>':
    case '!=':
      return FilterOperator.Neq;

    case FilterOperator.Ge:
    case '>':
      return FilterOperator.Ge;

    case FilterOperator.Geq:
    case '>=':
      return FilterOperator.Geq;

    case FilterOperator.Le:
    case '<':
      return FilterOperator.Le;

    case FilterOperator.Leq:
    case '<=':
      return FilterOperator.Leq;
  }

  throw new Error(`Unknown filter operator ${value}`);
};
