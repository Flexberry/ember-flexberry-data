import Ember from 'ember';
import DS from 'ember-data';

import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, GeographyPredicate } from './predicate';
import FilterOperator from './filter-operator';
import Information from '../utils/information';
import getSerializedDateValue from '../utils/get-serialized-date-value';
import { classify } from '../utils/string-functions';

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
      $select: this._buildODataSelect(query),
      $expand: this._buildODataExpand(query)
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

    let customQueryParams = query.customQueryParams || {};
    for (let param in customQueryParams) {
      if (customQueryParams.hasOwnProperty(param)) {
        odataArgs[param] = customQueryParams[param];
      }
    }

    return odataArgs;
  }

  /**
    Returns full URL for querying OData feed (base part and query part).

    @method getODataFullUrl
    @param {Object} query The query for building OData URL.
    @return {String} Full URL.
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

    return `${this._baseUrl}${queryMark}${queryPart}`;
  }

  _buildODataSelect(query) {
    return query.select.map((i) => this._getODataAttributeName(query.modelName, i, true)).join(',');
  }

  _buildODataExpand(query) {
    let _this = this;
    let f = function (select, expand, modelName) {
      let oDataSelect = select
        .map(i => _this._getODataAttributeName(modelName, i, true))
        .join(',');

      let oDataExpand = Object.keys(expand)
        .map(i => {
          let data = expand[i];
          let { oDataSelect, oDataExpand } = f(data.select, data.expand, _this._info.getMeta(modelName, i).type);

          let m = [];
          let b = false;

          if (oDataSelect) {
            m.push(`$select=${oDataSelect}`);
            b = true;
          }

          if (oDataExpand) {
            m.push(`$expand=${oDataExpand}`);
            b = true;
          }

          let p1 = b ? '(' : '';
          let p2 = b ? ')' : '';
          let attribute = _this._getODataAttributeName(modelName, i, true);
          return `${attribute}${p1}${m.join(';')}${p2}`;
        })
        .join(',');

      return { oDataSelect, oDataExpand };
    };

    return f(query.select, query.expand, query.modelName).oDataExpand;
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
    let predicate  = query.predicate;

    // Loading data using `CollectionName(Id)` syntax is not supported
    // by default logic of `DS.JSONSerializer` with our store mixin (it
    // supposes arrays when uses `query` method).
    // Specified `id` should be used simply as a filter.
    if (query.id) {
      if (!predicate) {
        predicate = new SimplePredicate('id', FilterOperator.Eq, query.id);
      } else {
        predicate = predicate.and(new SimplePredicate('id', FilterOperator.Eq, query.id));
      }
    }

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
      let attribute = this._getODataAttributeName(query.modelName, property.name);
      result += `${sep}${attribute}${direction}`;
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
    if (predicate instanceof SimplePredicate || predicate instanceof DatePredicate) {
      return this._buildODataSimplePredicate(predicate, modelName, prefix);
    }

    if (predicate instanceof StringPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}/${attribute}`;
      }

      return `contains(${attribute},'${predicate.containsValue}')`;
    }

    if (predicate instanceof GeographyPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}/${attribute}`;
      }

      return `geo.intersects(geography1=${attribute},geography2=geography'${predicate.intersectsValue}')`;
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

      let additionalPrefix = 'f';
      let meta = this._info.getMeta(modelName, predicate.detailPath);
      let detailPredicate = this._convertPredicateToODataFilterClause(predicate.predicate, meta.type, prefix + additionalPrefix, level);
      let detailPath = this._getODataAttributeName(modelName, predicate.detailPath);

      return `${detailPath}/${func}(${additionalPrefix}:${detailPredicate})`;
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

  _getODataAttributeName(modelName, attributePath, noIdConversion) {
    let attr = [];
    let lastModel = modelName;
    let fields = Information.parseAttributePath(attributePath);
    for (let i = 0; i < fields.length; i++) {
      let meta = this._info.getMeta(lastModel, fields[i]);
      if (meta.isMaster) {
        lastModel = meta.type;
      }

      let serializer = this._store.serializerFor(lastModel);

      if (i + 1 === fields.length) {
        if (meta.isMaster) {
          attr.push(serializer.keyForAttribute(fields[i]));
          if (!noIdConversion) {
            attr.push(serializer.primaryKey);
          }
        } else if (meta.isKey) {
          attr.push(serializer.primaryKey);
        } else {
          attr.push(serializer.keyForAttribute(fields[i]));
        }
      } else {
        attr.push(serializer.keyForAttribute(fields[i]));
      }
    }

    return attr.join('/');
  }

  _buildODataSimplePredicate(predicate, modelName, prefix) {
    let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
    if (prefix) {
      attribute = `${prefix}/${attribute}`;
    }

    let value;
    if (predicate.value === null) {
      value = 'null';
    } else {
      let meta = this._info.getMeta(modelName, predicate.attributePath);
      if (meta.isKey) {
        if (meta.keyType === 'guid') {
          value = predicate.value;
        } else {
          throw new Error(`Unsupported key type '${meta.keyType}'.`);
        }
      } else if (meta.isEnum) {
        let type = meta.sourceType;
        if (!type) {
          Ember.warn(`Source type is not specified for the enum '${meta.type}' (${modelName}.${predicate.attributePath}).`,
          false,
          { id: 'ember-flexberry-data-debug.odata-adapter.source-type-is-not-specified-for-enum' });
          type = classify(meta.type);
        }

        value = `${type}'${predicate.value}'`;
      } else if (meta.type === 'string') {
        value = `'${predicate.value}'`;
      } else if (meta.type === 'date') {
        value = getSerializedDateValue.call(this._store, predicate.value);
      } else {
        value = predicate.value;
      }
    }

    let operator = this._getODataFilterOperator(predicate.operator);
    return `${attribute} ${operator} ${value}`;
  }
}
