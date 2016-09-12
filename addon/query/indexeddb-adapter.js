import Ember from 'ember';
import Dexie from 'npm:dexie';

import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import Condition from './condition';
import { getAttributeFilterFunction, buildProjection, buildOrder, buildTopSkip } from './js-adapter';
import Information from '../utils/information';

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
   * @param {DS.Store} store
   * @param {Query} Query language instance to the adapter.
   * @returns {Ember.RSVP.Promise} Promise with loaded data.
   * @public
   */
  query(store, query) {
    let db = new Dexie(this._databaseName);
    let schema = getSchemaFromProjection(store, query);
    if (!Ember.$.isEmptyObject(schema)) {
      db.version(1).stores(schema);
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      db.open().then((db) => {
        try {
          let table = Ember.$.isEmptyObject(schema) ? db.table(query.modelName) : db[query.modelName];
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
 * Builds IndexedDB database schema by given query object.
 *
 * @param {DS.Store} store
 * @param {Query} query Query language instance for loading data.
 * @returns {Object} IndexedDB database schema.
 */
function getSchemaFromProjection(store, query) {
  let storeSchema = {};
  let information = new Information(store);

  let fieldContainsInSchema = (modelName, field) => {
    if (Ember.isEmpty(storeSchema[modelName])) {
      return false;
    } else {
      let fieldsArray = storeSchema[modelName].split(',');
      return (fieldsArray.indexOf(field) > -1) || (fieldsArray.indexOf('*' + field) > -1);
    }
  };

  let getSchemaForAttribute = (property) => {
    let fields = Information.parseAttributePath(property);
    let propertyName = fields.length === 1 ? property : fields[0];
    if (!fieldContainsInSchema(query.modelName, propertyName)) {
      storeSchema[query.modelName] += information.isDetail(query.modelName, propertyName) ? ',*' + propertyName : ',' + propertyName;
    }

    if (fields.length > 1) {
      let lastModelName = query.modelName;
      for (let i = 1; i < fields.length; i++) {
        let meta = information.getMeta(lastModelName, fields[i - 1]);
        lastModelName = meta.type;
        if (Ember.isEmpty(storeSchema[lastModelName])) {
          storeSchema[lastModelName] = 'id';
        }

        if (!fieldContainsInSchema(lastModelName, fields[i])) {
          storeSchema[lastModelName] += information.isDetail(lastModelName, fields[i]) ? ',*' + fields[i] : ',' + fields[i];
        }
      }
    }
  };

  if (!Ember.isEmpty(query.projectionName)) {
    let getSchemaForModel = (proj) => {
      let attrs = proj.attributes;
      storeSchema[proj.modelName] = 'id';
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key) && !Ember.isNone(attrs[key].kind)) {
          if (!fieldContainsInSchema(proj.modelName, key)) {
            storeSchema[proj.modelName] += attrs[key].kind === 'hasMany' ? ',*' + key : ',' + key;
          }

          if (attrs[key].kind === 'belongsTo' || attrs[key].kind === 'hasMany') {
            getSchemaForModel(attrs[key]);
          }
        }
      }
    };

    let modelType = store.modelFor(query.modelName);
    let projection = modelType.projections.get(query.projectionName);
    getSchemaForModel(projection);
  } else if (!Ember.isEmpty(query.select)) {
    storeSchema[query.modelName] = 'id';
    query.select.forEach(function(property) {
      getSchemaForAttribute(property);
    });
  }

  if (!Ember.isEmpty(query.predicate)) {
    let getSchemaForAttributesOfSimplePredicate = (prefix, predicate) => {
      Ember.assert('Given predicate is not an instance of SimplePredicate', predicate instanceof SimplePredicate);
      let attributeName = Ember.isEmpty(prefix) ? predicate.attributePath : prefix + '.' + predicate.attributePath;
      getSchemaForAttribute(attributeName);
    };

    let getSchemaForAttributesOfStringPredicate = (prefix, predicate) => {
      Ember.assert('Given predicate is not an instance of StringPredicate', predicate instanceof StringPredicate);
      let attributeName = Ember.isEmpty(prefix) ? predicate.attributePath : prefix + '.' + predicate.attributePath;
      getSchemaForAttribute(attributeName);
    };

    let getSchemaForAttributesOfComplexPredicate = (prefix, predicate) => {
      Ember.assert('Given predicate is not an instance of ComplexPredicate', predicate instanceof ComplexPredicate);
      predicate.predicates.forEach(p => {
        if (p instanceof SimplePredicate) {
          getSchemaForAttributesOfSimplePredicate(prefix, p);
        } else if (p instanceof StringPredicate) {
          getSchemaForAttributesOfStringPredicate(prefix, p);
        } else if (p instanceof ComplexPredicate) {
          getSchemaForAttributesOfComplexPredicate(prefix, p);
        } else if (p instanceof DetailPredicate) {
          getSchemaForAttributesOfDetailPredicate(prefix, p);
        }
      });
    };

    let getSchemaForAttributesOfDetailPredicate = (prefix, predicate) => {
      Ember.assert('Given predicate is not an instance of DetailPredicate', predicate instanceof DetailPredicate);
      let attributeName = Ember.isEmpty(prefix) ? predicate.detailPath : prefix + '.' + predicate.detailPath;
      getSchemaForAttribute(attributeName);
      let p = predicate.predicate;
      if (p instanceof SimplePredicate) {
        getSchemaForAttributesOfSimplePredicate(attributeName, p);
      } else if (p instanceof StringPredicate) {
        getSchemaForAttributesOfStringPredicate(attributeName, p);
      } else if (p instanceof ComplexPredicate) {
        getSchemaForAttributesOfComplexPredicate(attributeName, p);
      } else if (p instanceof DetailPredicate) {
        getSchemaForAttributesOfDetailPredicate(attributeName, p);
      }
    };

    if (query.predicate instanceof SimplePredicate) {
      getSchemaForAttributesOfSimplePredicate('', query.predicate);
    } else if (query.predicate instanceof StringPredicate) {
      getSchemaForAttributesOfStringPredicate('', query.predicate);
    } else if (query.predicate instanceof ComplexPredicate) {
      getSchemaForAttributesOfComplexPredicate('', query.predicate);
    } else if (query.predicate instanceof DetailPredicate) {
      getSchemaForAttributesOfDetailPredicate('', query.predicate);
    }
  }

  return storeSchema;
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
