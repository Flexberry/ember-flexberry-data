import BaseAdapter from './query-base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate } from './query-predicate';

/**
 * Class of query adapter that translates query object into OData URL.
 *
 * @module ember-flexberry-projections
 * @class ODataAdapter
 */
export default class ODataAdapter extends BaseAdapter {
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
   *
   * @param query {QueryBuilder} The query for building OData URL.
   * @returns {String}
   */
  getODataUrl(query) {
    let odataArgs = [];

    // TODO: do not use order,expand with count
    for (let k in builders) {
      if (builders.hasOwnProperty(k)) {
        let v = builders[k](query, this._store);
        if (v) {
          odataArgs.push(`${k}=${v}`);
        }
      }
    }

    let queryMark = odataArgs.length > 0 ? '?' : '';
    let queryPart = odataArgs.join('&');

    return `${this._baseUrl}/${query.entity}${queryMark}${queryPart}`;
  }

  getOData(query) {
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

  return convertPredicateToODataFilterClause(predicate, store, query.entity);
}

function buildODataOrderBy(query) {
  if (!query.order) {
    return null;
  }

  let result = '';
  for (let i = 0; i < query.order.length; i++) {
    let property = query.order.property(i);
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
 * @param store
 * @returns {String} OData filter part.
 */
function convertPredicateToODataFilterClause(predicate, store, modelName) {
  if (predicate instanceof SimplePredicate) {
    let type;
    store.modelFor(modelName).eachAttribute(function(name, meta) {
      if (name === predicate.property) {
        type = meta.type;
      }
    });

    let value = type === 'string' ? `'${predicate.value}'` : predicate.value;

    return `${predicate.property} ${predicate.operator} ${value}`;
  }

  if (predicate instanceof StringPredicate) {
    return `contains('${predicate.attributeName}','${predicate.containsValue}')`;
  }

  if (predicate instanceof ComplexPredicate) {
    let separator = ` ${predicate.condition} `;
    return predicate.predicates
      .map(i => convertPredicateToODataFilterClause(i, store, modelName)).join(separator);
  }

  throw new Error(`Unknown predicate '${predicate}'`);
}
