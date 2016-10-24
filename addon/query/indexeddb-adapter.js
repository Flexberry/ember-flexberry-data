/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import { getAttributeFilterFunction, buildProjection, buildOrder, buildTopSkip, buildFilter } from './js-adapter';
import Information from '../utils/information';
import Dexie from 'npm:dexie';

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

    if (!db) {
      throw new Error('Database must be.');
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
      let filter = query.predicate ? buildFilter(query.predicate) : (data) => data;
      let table = this._db.table(query.modelName);

      updateWhereClause(table, query).toArray().then((data) => {
        Dexie.Promise.all(data.map(i => i.loadRelationships(query.projectionName))).then(() => {
          let filteredData = filter(data);
          let response = { meta: {}, data: projection(topskip(order(filteredData))) };
          if (query.count) {
            response.meta.count = filteredData.length;
          }

          resolve(response);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

/**
  Builds Dexie `WhereClause` for filtering data.
  Filtering only with Dexie can applied only for simple cases (for `SimplePredicate`).
  For complex cases all logic implemened programmatically.
  If `query.predicate` contains restrictions by relationships, return `table` without restrictions.

  @param {Dexie.Table} table Table instance for loading objects.
  @param {Query} query Query language instance for loading data.
  @returns {Dexie.Collection|Dexie.Table} Table or collection that can be used with `toArray` method.
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

  if (!predicate || containsRelationships(predicate)) {
    return table;
  }

  if (predicate instanceof SimplePredicate) {
    let value = typeof predicate.value === 'boolean' ? `${predicate.value}` : predicate.value;
    if (value === null) {
      // IndexedDB (and Dexie) doesn't support null - use JS filter instead.
      // https://github.com/dfahlander/Dexie.js/issues/153
      return table.filter(getAttributeFilterFunction(predicate));
    }

    switch (predicate.operator) {
      case FilterOperator.Eq:
        return table.where(predicate.attributePath).equals(value);

      case FilterOperator.Neq:
        return table.where(predicate.attributePath).notEqual(value);

      case FilterOperator.Le:
        return table.where(predicate.attributePath).below(value);

      case FilterOperator.Leq:
        return table.where(predicate.attributePath).belowOrEqual(value);

      case FilterOperator.Ge:
        return table.where(predicate.attributePath).above(value);

      case FilterOperator.Geq:
        return table.where(predicate.attributePath).aboveOrEqual(value);

      default:
        throw new Error('Unknown operator');
    }
  }

  if (predicate instanceof StringPredicate || predicate instanceof ComplexPredicate) {
    return table.filter(getAttributeFilterFunction(predicate));
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
  Checks predicate on contains restrictions by relationships.

  @method containsRelationships
  @param {Query.BasePredicate} predicate
  @return {Boolean}
*/
function containsRelationships(predicate) {
  if (predicate instanceof SimplePredicate || predicate instanceof StringPredicate) {
    return Information.parseAttributePath(predicate.attributePath).length > 1;
  }

  if (predicate instanceof DetailPredicate) {
    return true;
  }

  if (predicate instanceof ComplexPredicate) {
    let contains = false;
    predicate.predicates.forEach((predicate) => {
      if (predicate instanceof SimplePredicate || predicate instanceof StringPredicate) {
        contains = Information.parseAttributePath(predicate.attributePath).length > 1;
      } else {
        contains = containsRelationships(predicate);
      }
    });
    return contains;
  }
}
