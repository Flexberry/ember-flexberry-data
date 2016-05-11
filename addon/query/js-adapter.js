import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate } from './predicate';
import FilterOperator from './filter-operator';
import Condition from './condition';

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
 * @module ember-flexberry-projections
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
function buildTopSkip(query) {
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
function buildOrder(query) {
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
function buildProjection(query) {
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
 * @param predicate Predicate for array of objects.
 * @returns {Function}
 */
function buildFilter(predicate) {
  if (predicate instanceof SimplePredicate || predicate instanceof StringPredicate) {
    return getSimpleFilterFunction(predicate);
  }

  if (predicate instanceof ComplexPredicate) {
    let filterFunctions = predicate.predicates.map(getAttributeFilterFunction);
    switch (predicate.condition) {
      case Condition.And:
        return getComplexFilterFunctionAnd(filterFunctions);

      case Condition.Or:
        return getComplexFilterFunctionOr(filterFunctions);

      default:
        throw new Error(`Unsupported condition '${predicate.condition}'.`);
    }
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
 * Returns function for filtering array of objects using simple or string predicate.
 * Result function filters array of objects and returns those, for which
 * an attribute filter function returned `true`.
 *
 * @param {Query.SimplePredicate|Query.ComplexPredicate} predicate Predicate for array of objects.
 * @returns {Function}
 */
function getSimpleFilterFunction(predicate) {
  let attributeFilter = getAttributeFilterFunction(predicate);
  return function (data) {
    let result = [];
    data.forEach(i => {
      if (attributeFilter(i)) {
        result.push(i);
      }
    });
    return result;
  };
}

/**
 * Returns function for filtering single attribute of an object using predicate.
 *
 * @param {Query.SimplePredicate|Query.ComplexPredicate} predicate Predicate for an attribute.
 * @returns {Function} Function for filtering single attribute.
 */
function getAttributeFilterFunction(predicate) {
  if (predicate instanceof SimplePredicate) {
    switch (predicate.operator) {
      case FilterOperator.Eq:
        return function (i) { return i[predicate.attributeName] === predicate.value; };

      case FilterOperator.Neq:
        return function (i) { return i[predicate.attributeName] !== predicate.value; };

      case FilterOperator.Le:
        return function (i) { return i[predicate.attributeName] < predicate.value; };

      case FilterOperator.Leq:
        return function (i) { return i[predicate.attributeName] <= predicate.value; };

      case FilterOperator.Ge:
        return function (i) { return i[predicate.attributeName] > predicate.value; };

      case FilterOperator.Geq:
        return function (i) { return i[predicate.attributeName] >= predicate.value; };

      default:
        throw new Error(`Unsupported filter operator '${predicate.operator}'.`);
    }
  }

  if (predicate instanceof StringPredicate) {
    return function (i) { return i[predicate.attributeName].indexOf(predicate.containsValue) > -1; };
  }
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
function getComplexFilterFunctionAnd(filterFunctions) {
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
function getComplexFilterFunctionOr(filterFunctions) {
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
