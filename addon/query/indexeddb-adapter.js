import Ember from 'ember';
import Dexie from 'npm:dexie';

import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import Condition from './condition';
import { getAttributeFilterFunction, buildProjection, buildOrder, buildTopSkip } from './js-adapter';

/**
 * Class of query language adapter that allows to load data from IndexedDB.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class IndexedDbAdapter
 * @extends Query.BaseAdapter
 */
export default class extends BaseAdapter {
  constructor(databaseName) {
    super();

    if (!databaseName) {
      throw new Error('Database name is not specified');
    }

    this._databaseName = databaseName;
  }

  /**
   * Loads data from IndexedDB.
   *
   * @method query
   * @param {Query} Query language instance to the adapter.
   * @returns {Ember.RSVP.Promise} Promise with loaded data.
   * @public
   */
  query(query) {
    let db = new Dexie(this._databaseName);
    return new Ember.RSVP.Promise((resolve, reject) => {
      db.open().then(() => {
        try {
          let table = db.table(query.modelName);
          let projection = buildProjection(query);
          let order = buildOrder(query);
          let topskip = buildTopSkip(query);

          updateWhereClause(table, query).toArray().then((data) => {
            resolve(projection(order(topskip(data))));
          }).catch((e) => reject(e)).finally(() => db.close());
        } catch (e) {
          reject(e);
        } finally {
          db.close();
        }
      }).catch((e) => reject(e));
    });
  }
}

/**
 * Builds Dexie `WhereClause` for filtering data.
 * Filtering only with Dexie can applied only for simple cases (for `SimplePredicate`).
 * For complex cases all logic implemened programmatically.
 *
 * @param {Dexie.Table} table Table instance for loading objects.
 * @param {Query} query Query language instance for loading data.
 * @returns {Dexie.Collection|Dexie.Table} Tbale or collection that can be used with `toArray` method.
 */
function updateWhereClause(table, query) {
  if (!query.predicate) {
    return table;
  }

  let predicate = query.predicate;
  if (predicate instanceof SimplePredicate) {
    switch (predicate.operator) {
      case FilterOperator.Eq:
        return table.where(predicate.attributeName).equals(predicate.value);

      case FilterOperator.Neq:
        return table.where(predicate.attributeName).notEqual(predicate.value);

      case FilterOperator.Le:
        return table.where(predicate.attributeName).below(predicate.value);

      case FilterOperator.Leq:
        return table.where(predicate.attributeName).belowOrEqual(predicate.value);

      case FilterOperator.Ge:
        return table.where(predicate.attributeName).above(predicate.value);

      case FilterOperator.Geq:
        return table.where(predicate.attributeName).aboveOrEqual(predicate.value);

      default:
        throw new Error('Unknown operator');
    }
  }

  if (predicate instanceof StringPredicate) {
    return table.filter(getAttributeFilterFunction(predicate));
  }

  if (predicate instanceof ComplexPredicate) {
    let filterFunctions = predicate.predicates.map(getAttributeFilterFunction);
    let collection = table.toCollection();
    switch (predicate.condition) {
      case Condition.And:
        return collection.filter(getComplexFilterFunctionAnd(filterFunctions));

      case Condition.Or:
        return collection.filter(getComplexFilterFunctionOr(filterFunctions));

      default:
        throw new Error(`Unsupported condition '${predicate.condition}'.`);
    }

    return table.filter(getAttributeFilterFunction(predicate));
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
 * Returns complex filter function for `and` condition.
 * Result function returns `true` if all attribute filter functions returned `true`.
 * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @param {Function[]} filterFunctions Array of attribute filter functions.
 * @returns {Function} Complex filter function for `or` condition.
 */
function getComplexFilterFunctionAnd(filterFunctions) {
  return function (item) {
    let check = true;
    for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
      check &= filterFunctions[funcIndex](item);
      if (!check) {
        break;
      }
    }

    return check;
  };
}

/**
 * Returns complex filter function for `or` condition.
 * Result function returns `true` if at least one attribute filter function returned `true`.
 * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @param {Function[]} filterFunctions Array of attribute filter functions.
 * @returns {Function} Complex filter function for `or` condition.
 */
function getComplexFilterFunctionOr(filterFunctions) {
  return function (item) {
    let check = false;
    for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
      check |= filterFunctions[funcIndex](item);
      if (check) {
        break;
      }
    }

    return check;
  };
}
