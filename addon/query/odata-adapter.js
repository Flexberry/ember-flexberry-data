import Ember from 'ember';

import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate } from './predicate';

/**
 * Class of query adapter that translates query object into OData URL.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class ODataAdapter
 * @extends Query.BaseAdapter
 */
export default class ODataAdapter extends BaseAdapter {
  /**
   * @param {String} baseUrl
   * @param {EdmberData.Store} store
   * @class ODataAdapter
   * @constructor
   */
  constructor(baseUrl, store) {
    super();

    if (!baseUrl) {
      throw new Error('Base URL for OData feed is required');
    }

    if (!store) {
      throw new Error('Store is required');
    }

    this._baseUrl = baseUrl;
    this._store = store;
  }

  /**
   * Determines the pathname for a given type.
   * Additionally capitalizes the type name (requirement of Flexberry OData Server).
   *
   * @method pathForType
   * @param {String} modelName
   * @return {String} The path for a given type.
   */
  pathForType(modelName) {
    var camelized = Ember.String.camelize(modelName);
    var capitalized = Ember.String.capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  }

  /**
   * Returns base part of URL for querying OData feed (without query part).
   *
   * @method getODataFullUrl
   * @param {Object} query The query for building OData URL.
   * @return {String}
   * @public
   */
  getODataBaseUrl(query) {
    let type = this.pathForType(query.modelName);
    let id = query.id ? `(${query.id})` : '';

    return `${this._baseUrl}/${type}${id}`;
  }

  /**
   * Returns query data for querying OData feed (for query part).
   *
   * @method getODataQuery
   * @param {Object} query The query for building OData URL.
   * @return {Object}
   * @public
   */
  getODataQuery(query) {
    let odataArgs = {};

    // TODO: do not use order,expand with count
    for (let k in builders) {
      if (builders.hasOwnProperty(k)) {
        let v = builders[k](query, this._store);
        if (v !== null && v !== '') {
          odataArgs[k] = v;
        }
      }
    }

    return odataArgs;
  }

  /**
   * Returns full URL for querying OData feed (base part and query part).
   *
   * @method getODataFullUrl
   * @param {Object} query The query for building OData URL.
   * @return {String}
   * @public
   */
  getODataFullUrl(query) {
    let odataArgs = this.getODataQuery(query);
    let queryArgs = [];
    Object.keys(odataArgs).forEach(k => {
      let v = odataArgs[k];
      if (v) {
        queryArgs.push(`${k}=${v}`);
      }
    });
    let queryMark = queryArgs.length > 0 ? '?' : '';
    let queryPart = queryArgs.join('&');

    return this.getODataBaseUrl(query) + queryMark + queryPart;
  }
}

var builders = {
  $filter: buildODataFilters,
  $orderby: buildODataOrderBy,
  $skip: buildODataSkip,
  $top: buildODataTop,
  $count: buildODataCount,
  $expand: buildODataExpand,
  $select: buildODataSelect
};

function buildODataSelect(query) {
  return query.select.join(',');
}

function buildODataExpand(query) {
  return query.expand.join(',');
}

function buildODataCount(query) {
  return query.count ? true : null;
}

function buildODataSkip(query) {
  return query.skip;
}

function buildODataTop(query) {
  return query.top;
}

function buildODataFilters(query, store) {
  let predicate = query.predicate;
  if (!predicate) {
    return null;
  }

  return convertPredicateToODataFilterClause(predicate, store, query.modelName);
}

function buildODataOrderBy(query) {
  if (!query.order) {
    return null;
  }

  let result = '';
  for (let i = 0; i < query.order.length; i++) {
    let property = query.order.attribute(i);
    let sep = i ? ',' : '';
    let direction = property.direction ? ` ${property.direction}` : '';
    result += `${sep}${property.name}${direction}`;
  }

  return result;
}

/**
 * Converts specified predicate into OData filter part.
 *
 * @method convertPredicateToODataFilterClause
 * @param predicate {BasePredicate} Predicate to convert.
 * @param store
 * @return {String} OData filter part.
 */
function convertPredicateToODataFilterClause(predicate, store, modelName) {
  if (predicate instanceof SimplePredicate) {
    let type;
    store.modelFor(modelName).eachAttribute(function(name, meta) {
      if (name === predicate.attributeName) {
        type = meta.type;
      }
    });

    if (!type) {
      throw new Error(`Unknown type for '${predicate.attributeName}' attribute.`);
    }

    let value = type === 'string' ? `'${predicate.value}'` : predicate.value;
    return `${store.serializerFor(modelName).keyForAttribute(predicate.attributeName)} ${predicate.operator} ${value}`;
  }

  if (predicate instanceof StringPredicate) {
    return `contains(${store.serializerFor(modelName).keyForAttribute(predicate.attributeName)},'${predicate.containsValue}')`;
  }

  if (predicate instanceof ComplexPredicate) {
    let separator = ` ${predicate.condition} `;
    return predicate.predicates
      .map(i => convertPredicateToODataFilterClause(i, store, modelName)).join(separator);
  }

  throw new Error(`Unknown predicate '${predicate}'`);
}
