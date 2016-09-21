/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import Condition from './condition';
import { getAttributeFilterFunction, buildProjection, buildOrder, buildTopSkip } from './js-adapter';
import Information from '../utils/information';

/**
  Class of query language adapter that allows to load data from IndexedDB.

  @namespace Query
  @class IndexedDBAdapter
  @extends Query.BaseAdapter
*/
export default class extends BaseAdapter {
  /**
    @param {Dexie} db Dexie database instance.
    @class IndexedDBAdapter
    @constructor
  */
  constructor(db) {
    super();

    if (!db || !db.isOpen()) {
      throw new Error('Database must be opened.');
    }

    this._db = db;
  }

  /**
    Loads data from IndexedDB.

    @method query
    @param {QueryObject} QueryObject instance to the adapter.
    @return {Promise} Promise with loaded data.
  */
  query(query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let order = buildOrder(query);
      let topskip = buildTopSkip(query);
      let projection = buildProjection(query);
      let table = this._db.table(query.modelName);

      updateWhereClause(table, query).toArray().then((data) => {
        resolve(projection(order(topskip(data))));
      }).catch((error) => {
        reject(error);
      });
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
 * @returns {Dexie.Collection|Dexie.Table} Table or collection that can be used with `toArray` method.
 */
function updateWhereClause(table, query) {
  let predicate = query.predicate;

  if (query.id) {
    if (!predicate) {
      predicate = new SimplePredicate('id', FilterOperator.Eq, query.id);
    } else {
      predicate = predicate.and(new SimplePredicate('id', FilterOperator.Eq, query.id));
    }
  }

  if (!predicate) {
    return table;
  }

  if (predicate instanceof SimplePredicate) {
    let fields = Information.parseAttributePath(predicate.attributePath);
    if (predicate.value === null || fields.length > 1) {
      // IndexedDB (and Dexie) doesn't support null - use JS filter instead.
      // https://github.com/dfahlander/Dexie.js/issues/153
      return table.filter(getAttributeFilterFunction(predicate));
    }

    switch (predicate.operator) {
      case FilterOperator.Eq:
        return table.where(predicate.attributePath).equals(predicate.value);

      case FilterOperator.Neq:
        return table.where(predicate.attributePath).notEqual(predicate.value);

      case FilterOperator.Le:
        return table.where(predicate.attributePath).below(predicate.value);

      case FilterOperator.Leq:
        return table.where(predicate.attributePath).belowOrEqual(predicate.value);

      case FilterOperator.Ge:
        return table.where(predicate.attributePath).above(predicate.value);

      case FilterOperator.Geq:
        return table.where(predicate.attributePath).aboveOrEqual(predicate.value);

      default:
        throw new Error('Unknown operator');
    }
  }

  if (predicate instanceof StringPredicate || predicate instanceof DetailPredicate) {
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
