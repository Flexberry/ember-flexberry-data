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
      let table = this._db.table(query.modelName);
      let complexQuery = containsRelationships(query);
      let fastQuery = !complexQuery;
      if (fastQuery) {
        let offset = query.skip;
        let limit = query.top;

        table = updateWhereClause(table, query);

        if (table instanceof this._db.Table && (!query.order || (query.order && query.order.length === 1 && query.order.attribute(0).direction === 'asc'))) {
          // Go this way if filter is empty and simply sort by one field.
          if (query.order && query.order.length === 1 && query.order.attribute(0).direction === 'asc') {
            // Go this way if filter is empty and used asc order by one attribute.
            let orderBy = query.order.attribute(0).name;

            table = table.orderBy(orderBy); // Now table is Collection.
          }

          if (offset) {
            table = table.offset(offset);
          }

          if (limit) {
            table = table.limit(limit);
          }

          table.toArray().then((data) => {
            let length = data.length;

            let response = { meta: {}, data: data };
            if (query.count) {
              response.meta.count = length; // TODO: wrong count (need total count without skip-top).
            }

            resolve(response);
          }, reject).catch((error) => {reject(error);});
        } else {
          // Go this way if used simple filter.
          if (table instanceof this._db.Table) {
            table = table.toCollection();
          }

          let skipTopApplyed = false;

          if (query.order) {
            let sortFunc = function(a) {
                let len = query.order.length;

                let singleSort = function(a, b, i) {
                  if (i === undefined) {
                    i = 0;
                  }

                  if (i >= len) {
                    return 0;
                  }

                  let attrName = query.order.attribute(i).name;
                  let direction = query.order.attribute(i).direction;
                  i = i + 1;

                  if (direction === 'asc') {
                    return a[attrName] < b[attrName] ? -1 : a[attrName] > b[attrName] ? 1 : singleSort(a, b, i);
                  } else {
                    return a[attrName] > b[attrName] ? -1 : a[attrName] < b[attrName] ? 1 : singleSort(a, b, i);
                  }
                };

                return a.sort(singleSort);
              };

            table = table.toArray(sortFunc);
          } else {
            if (offset) {
              table = table.offset(offset);
            }

            if (limit) {
              table = table.limit(limit);
            }

            skipTopApplyed = true;
            table = table.toArray();
          }

          table.then(data => {
            let length = data.length; // TODO: if was called toArray, then that count is wrong (need total count without skip-top).

            // if this is result of sortBy() Promise need apply top-skip.
            if (!skipTopApplyed) {
              let topskip = buildTopSkip(query);
              data = topskip(data);
            } else {
              // TODO: get real count;
              length = 0;
            }

            let response = { meta: {}, data: data };
            if (query.count) {
              response.meta.count = length;
            }

            resolve(response);
          }, reject).catch((error) => {reject(error);});
        }
      } else {
        let isBadQuery = containsRelationships(query);
        let order = buildOrder(query);
        let topskip = buildTopSkip(query);
        let jsProjection = buildProjection(query); // TODO: if used select, then missed loadByProjection call.
        let table = this._db.table(query.modelName);
        let filter = query.predicate ? buildFilter(query.predicate, { booleanAsString: true }) : (data) => data;
        let projection = query.projectionName ? query.projectionName : query.projection ? query.projection : null;

        // Ember.warn('The next version is planned to change the behavior ' +
        //   'of loading data from offline store, without specify attributes ' +
        //   'and relationships will be loaded only their own object attributes.', projection, { id: 'IndexedDBAdapter.query' });

        (isBadQuery ? table : updateWhereClause(table, query)).toArray().then((data) => {
          let length = data.length;
          if (!isBadQuery) {
            data = topskip(order(data));
          }

          // TODO: Optimize calls extendProjection - enough one call.
          Dexie.Promise.all(data.map(i => i.loadByProjection(projection, extendProjection(query)))).then(() => {
            if (isBadQuery) {
              data = filter(data);
              length = data.length;
              data = topskip(order(data));
            }

            if (!projection) {
              data = jsProjection(data);
            }

            let response = { meta: {}, data: data };
            if (query.count) {
              response.meta.count = length;
            }

            resolve(response);
          }, reject);
        }, reject);
      }
    });
  }
}

/**
  Builds Dexie `WhereClause` for filtering data.
  Filtering only with Dexie can applied only for simple cases (for `SimplePredicate`).
  For complex cases all logic implemened programmatically.

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

  if (!predicate) {
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
    return table.filter(getAttributeFilterFunction(predicate, { booleanAsString: true }));
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
  Returns object with attributes that necessary include in projection for loading.

  @method extendProjection
  @param {QueryObject} query
  @return {Object}
*/
function extendProjection(query) {
  let extend = {};
  if (query.predicate instanceof SimplePredicate || query.predicate instanceof StringPredicate) {
    let path = '';
    Information.parseAttributePath(query.predicate.attributePath).forEach((attribute) => {
      Ember.set(extend, `${path}${attribute}`, {});
      path += `${attribute}.`;
    });
  }

  if (query.predicate instanceof DetailPredicate) {
    extend[query.predicate.detailPath] = extendProjection(query.predicate);
  }

  if (query.predicate instanceof ComplexPredicate) {
    query.predicate.predicates.forEach((predicate) => {
      Ember.merge(extend, extendProjection({ predicate }));
    });
  }

  if (query.order) {
    for (let i = 0; i < query.order.length; i++) {
      let path = '';
      let attributePath = Information.parseAttributePath(query.order.attribute(i).name);
      for (let i = 0; i < attributePath.length; i++) {
        Ember.set(extend, `${path}${attributePath[i]}`, {});
        path += `${attributePath[i]}.`;
      }
    }
  }

  return extend;
}

/**
  Checks query on contains restrictions by relationships.

  @method containsRelationships
  @param {QueryObject} query
  @return {Boolean}
*/
function containsRelationships(query) {
  let contains = false;
  if (query.predicate instanceof SimplePredicate || query.predicate instanceof StringPredicate) {
    contains = Information.parseAttributePath(query.predicate.attributePath).length > 1;
  }

  if (query.predicate instanceof DetailPredicate) {
    return true;
  }

  if (query.predicate instanceof ComplexPredicate) {
    query.predicate.predicates.forEach((predicate) => {
      if (containsRelationships({ predicate })) {
        contains = true;
      }
    });
  }

  if (query.order) {
    for (let i = 0; i < query.order.length; i++) {
      let attributePath = query.order.attribute(i).name;
      if (Information.parseAttributePath(attributePath).length > 1) {
        contains = true;
      }
    }
  }

  return contains;
}
