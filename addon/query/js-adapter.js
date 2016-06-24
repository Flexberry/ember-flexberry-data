import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import FilterOperator from './filter-operator';
import Condition from './condition';
import Information from '../utils/information';

/**
 * Class of query language adapter that translates query object into JS function which
 * filters native JS array of objects by specified logic.
 *
 * ```js
 * const data = [
 *   { Name: 'A', Surname: 'X', Age: 10 },
 *   { Name: 'B', Surname: 'Y', Age: 11 },
 *   { Name: 'B', Surname: 'Z', Age: 12 }
 * ];
 *
 * let adapter = new JSAdapter();
 * let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Eq, 'B');
 * let filter = adapter.buildFunc(builder.build());
 *
 * let result = filter(data); // Y and Z
 * ```
 *
 * All filters uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class JSAdapter
 * @extends Query.BaseAdapter
 */
export default class JSAdapter extends BaseAdapter {
  /**
   * Builds JS function for filtering JS array of objects by specified logic from query.
   *
   * @method buildFunc
   * @param query Query language instance.
   * @returns {Function} Function for filtering JS array of objects.
   */
  buildFunc(query) {
    let filter = query.predicate ? buildFilter(query.predicate) : (data) => data;
    let order = buildOrder(query);
    let projection = buildProjection(query);
    let topSkip = buildTopSkip(query);
    return function (data) {
      return projection(topSkip(order(filter(data))));
    };
  }
}

/**
 * Builds function for windowing array of objects using data from the query.
 *
 * @param query Query instance.
 * @returns {Function}
 */
export function buildTopSkip(query) {
  if (!query.top && !query.skip) {
    return data => data;
  }

  return data => {
    let r = [];
    for (let i = 0; i < data.length; i++) {
      if (i < query.skip) {
        continue;
      }

      r.push(data[i]);

      if (r.length >= query.top) {
        break;
      }
    }

    return r;
  };
}

/**
 * Builds function for ordering array of objects using data from the query.
 *
 * @param query Query instance.
 * @returns {Function}
 */
export function buildOrder(query) {
  if (!query.order) {
    return data => data;
  }

  let desc = (a, b, p) => {
    if (a[p] > b[p]) {
      return -1;
    } else if (a[p] < b[p]) {
      return 1;
    } else {
      return 0;
    }
  };

  let asc = (a, b, p) => {
    if (a[p] < b[p]) {
      return -1;
    } else if (a[p] > b[p]) {
      return 1;
    } else {
      return 0;
    }
  };

  return function (data) {
    return data.sort((a, b) => {
      for (let i = 0; i < query.order.length; i++) {
        let p = query.order.attribute(i);
        let r = p.direction === 'desc' ? desc(a, b, p.name) : asc(a, b, p.name); // TODO: desc / asc constants
        if (r === 0) {
          continue;
        }

        return r;
      }

      return 0;
    });
  };
}

/**
 * Builds function for selecting subset of properties from array of objects using data from the query.
 *
 * @param query Query instance.
 * @returns {Function}
 */
export function buildProjection(query) {
  if (!query.select || query.select.length === 0) {
    return data => data;
  }

  return function (data) {
    return data.map(item => {
      let r = {};
      for (let i = 0; i < query.select.length; i++) {
        r[query.select[i]] = item[query.select[i]];
      }

      return r;
    });
  };
}

/**
 * Builds function for filtering array of objects using predicate.
 *
 * @param predicate Predicate for filtering array of objects.
 * @returns {Function}
 */
function buildFilter(predicate) {
  let b1 = predicate instanceof SimplePredicate;
  let b2 = predicate instanceof StringPredicate;
  let b3 = predicate instanceof DetailPredicate;

  if (b1 || b2 || b3) {
    let filterFunction = getAttributeFilterFunction(predicate);
    return getFilterFunctionAnd([filterFunction]);
  }

  if (predicate instanceof ComplexPredicate) {
    let filterFunctions = predicate.predicates.map(getAttributeFilterFunction);
    switch (predicate.condition) {
      case Condition.And:
        return getFilterFunctionAnd(filterFunctions);

      case Condition.Or:
        return getFilterFunctionOr(filterFunctions);

      default:
        throw new Error(`Unsupported condition '${predicate.condition}'.`);
    }
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
 * Returns function for checkign single object using predicate.
 *
 * @param {Query.BasePredicate} predicate Predicate for an attribute.
 * @returns {Function} Function for checkign single object.
 */
export function getAttributeFilterFunction(predicate) {
  if (predicate instanceof SimplePredicate) {
    switch (predicate.operator) {
      case FilterOperator.Eq:
        return (i) => getValue(i, predicate.attributePath) === predicate.value;

      case FilterOperator.Neq:
        return (i) => getValue(i, predicate.attributePath) !== predicate.value;

      case FilterOperator.Le:
        return (i) => getValue(i, predicate.attributePath) < predicate.value;

      case FilterOperator.Leq:
        return (i) => getValue(i, predicate.attributePath) <= predicate.value;

      case FilterOperator.Ge:
        return (i) => getValue(i, predicate.attributePath) > predicate.value;

      case FilterOperator.Geq:
        return (i) => getValue(i, predicate.attributePath) >= predicate.value;

      default:
        throw new Error(`Unsupported filter operator '${predicate.operator}'.`);
    }
  }

  if (predicate instanceof StringPredicate) {
    return (i) => getValue(i, predicate.attributePath).indexOf(predicate.containsValue) > -1;
  }

  if (predicate instanceof DetailPredicate) {
    let detailFilter = buildFilter(predicate.predicate);
    if (predicate.isAll) {
      return function (i) {
        let detail = getValue(i, predicate.detailPath);
        if (!detail) {
          return false;
        }

        let result = detailFilter(detail);
        return result.length === detail.length;
      };
    } else if (predicate.isAny) {
      return function (i) {
        let detail = getValue(i, predicate.detailPath);
        if (!detail) {
          return false;
        }

        let result = detailFilter(detail);
        return result.length > 0;
      };
    } else {
      throw new Error(`Unsupported detail operation.`);
    }
  }

  if (predicate instanceof ComplexPredicate) {
    let filterFunctions = predicate.predicates.map(getAttributeFilterFunction);
    switch (predicate.condition) {
      case Condition.And:
        return function (i) {
          let check = true;
          for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
            check &= filterFunctions[funcIndex](i);
            if (!check) {
              break;
            }
          }

          return check;
        };

      case Condition.Or:
        return function (i) {
          let check = false;
          for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
            check |= filterFunctions[funcIndex](i);
            if (check) {
              break;
            }
          }

          return check;
        };

      default:
        throw new Error(`Unsupported condition '${predicate.condition}'.`);
    }
  }

  throw new Error(`Unsupported predicate '${predicate}'.`);
}

/**
 Loads value from object by specified attribute path.

 @param {Object} item Object for load value.
 @param {String} attributePath The path to the attribute.
 @returns {*|undefined} Value of attribute or `undefined`.
 */
function getValue(item, attributePath) {
  let attributes = Information.parseAttributePath(attributePath);
  let search = item;
  for (let i = 0; i < attributes.length; i++) {
    search = search[attributes[i]];
    if (!search) {
      // Don't return constant null / undefined - we need to distinguish them.
      return search;
    }
  }

  return search;
}

/**
 * Returns complex filter function for `and` condition.
 * Result function filters array of objects and returns those, for which
 * all attribute filter functions returned `true`.
 * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @param {Function[]} filterFunctions Array of attribute filter functions.
 * @returns {Function} Complex filter function for `or` condition.
 */
function getFilterFunctionAnd(filterFunctions) {
  return function (data) {
    let result = [];
    for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
      let check = true;
      for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
        check &= filterFunctions[funcIndex](data[itemIndex]);
        if (!check) {
          break;
        }
      }

      if (check) {
        result.push(data[itemIndex]);
      }
    }

    return result;
  };
}

/**
 * Returns complex filter function for `or` condition.
 * Result function filters array of objects and returns those, for which
 * at least one attribute filter function returned `true`.
 * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @param {Function[]} filterFunctions Array of attribute filter functions.
 * @returns {Function} Complex filter function for `or` condition.
 */
function getFilterFunctionOr(filterFunctions) {
  return function (data) {
    let result = [];
    for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
      let check = false;
      for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
        check |= filterFunctions[funcIndex](data[itemIndex]);
        if (check) {
          break;
        }
      }

      if (check) {
        result.push(data[itemIndex]);
      }
    }

    return result;
  };
}
