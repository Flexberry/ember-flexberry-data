/**
 * Enumeration of operators for filtration.
 *
 * @module ember-flexberry-projections
 * @class FilterOperator
 */
export default class FilterOperator { }
FilterOperator.Eq = 'eq';
FilterOperator.Neq = 'neq';
FilterOperator.Ge = 'ge';
FilterOperator.Geq = 'geq';
FilterOperator.Le = 'le';
FilterOperator.Leq = 'leq';

/**
 * Tries to build filter operator from specified value.
 *
 * @param value {*} Value with filter operator.
 * @returns {FilterOperator}
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
