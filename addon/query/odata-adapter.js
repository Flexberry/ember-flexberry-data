import Ember from 'ember';
import DS from 'ember-data';

import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import FilterOperator from './filter-operator';
import Information from '../utils/information';

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

    if (!store || !(store instanceof DS.Store)) {
      throw new Error('Store is required');
    }

    this._baseUrl = baseUrl;
    this._store = store;
    this._info = new Information(store);
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
    let builders = {
      $filter: this._buildODataFilters(query),
      $orderby: this._buildODataOrderBy(query),
      $skip: this._buildODataSkip(query),
      $top: this._buildODataTop(query),
      $count: this._buildODataCount(query),
      $expand: this._buildODataExpand(query),
      $select: this._buildODataSelect(query)
    };

    // TODO: do not use order,expand with count
    let odataArgs = {};
    for (let k in builders) {
      if (builders.hasOwnProperty(k)) {
        let v = builders[k];
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

  _buildODataSelect(query) {
    return query.select.join(',');
  }

  _buildODataExpand(query) {
    return query.expand.join(',');
  }

  _buildODataCount(query) {
    return query.count ? true : null;
  }

  _buildODataSkip(query) {
    return query.skip;
  }

  _buildODataTop(query) {
    return query.top;
  }

  _buildODataFilters(query) {
    let predicate = query.predicate;
    if (!predicate) {
      return null;
    }

    return this._convertPredicateToODataFilterClause(predicate, query.modelName, '', 0);
  }

  _buildODataOrderBy(query) {
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
   * @param predicate {BasePredicate} Predicate to convert.
   * @param {String} prefix Prefix for detail attributes.
   * @param {Number} level Nesting level for recursion with comples predicates.
   * @return {String} OData filter part.
   */
  _convertPredicateToODataFilterClause(predicate, modelName, prefix, level) {
    if (predicate instanceof SimplePredicate) {
      let type = this._info.getType(modelName, predicate.attributePath);
      if (!type) {
        throw new Error(`Unknown type for '${predicate.attributePath}' attribute of '${modelName}' model.`);
      }

      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}:${prefix}/${attribute}`;
      }

      let value = type === 'string' ? `'${predicate.value}'` : predicate.value;
      let operator = this._getODataFilterOperator(predicate.operator);
      return `${attribute} ${operator} ${value}`;
    }

    if (predicate instanceof StringPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}:${prefix}/${attribute}`;
      }

      return `contains(${attribute},'${predicate.containsValue}')`;
    }

    if (predicate instanceof DetailPredicate) {
      let func = '';
      if (predicate.isAll) {
        func = 'all';
      } else if (predicate.isAny) {
        func = 'any';
      } else {
        throw new Error(`OData supports only 'any' or 'or' operations for details`);
      }

      let detailPredicate = this._convertPredicateToODataFilterClause(predicate.predicate, modelName, prefix + 'f', level);

      return `${predicate.detailPath}/${func}(${detailPredicate})`;
    }

    if (predicate instanceof ComplexPredicate) {
      let separator = ` ${predicate.condition} `;
      let result = predicate.predicates
        .map(i => this._convertPredicateToODataFilterClause(i, modelName, prefix, level + 1)).join(separator);
      let lp = level > 0 ? '(' : '';
      let rp = level > 0 ? ')' : '';
      return lp + result + rp;
    }

    throw new Error(`Unknown predicate '${predicate}'`);
  }

  /**
   * Converts filter operator to OData representation.
   *
   * @param {Query.FilterOperator} operator Operator to convert.
   * @returns {String} Converted operator.
   */
  _getODataFilterOperator(operator) {
    switch (operator) {
      case FilterOperator.Eq:
        return 'eq';

      case FilterOperator.Neq:
        return 'ne';

      case FilterOperator.Le:
        return 'lt';

      case FilterOperator.Leq:
        return 'le';

      case FilterOperator.Ge:
        return 'gt';

      case FilterOperator.Geq:
        return 'ge';

      default:
        throw new Error(`Unsupported filter operator '${operator}'.`);
    }
  }

  _getODataAttributeName(modelName, attributePath) {
    return this._store.serializerFor(modelName).keyForAttribute(attributePath).replace(/\./g, '/');
  }
}
