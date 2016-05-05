import DS from 'ember-data';
import { BasePredicate, SimplePredicate } from './query-predicate';
import OrderByClause from './query-order-by-clause';

/**
 * Class of builder for query.
 * Uses method chaining.
 *
 * @module ember-flexberry-projections
 * @class QueryBuilder
 */
export default class QueryBuilder {
  /**
   * Class constructor.
   *
   * @param store {Store} Store for building query.
   * @param modelName {String} The name of the requested entity.
   */
  constructor(store, modelName) {
    if (!store || !(store instanceof DS.Store)) {
      throw new Error('Store is not specified');
    }

    this._store = store;
    this._modelName = modelName;

    this._projectionName = null;
    this._predicate = null;
    this._orderByClause = null;
    this._isCount = false;
    this._expand = {};
    this._select = [];
  }

  /**
   * Sets the name of the requested entity.
   *
   * @param entityName {String} The name of the requested entity.
   * @returns {QueryBuilder} Returns this instance.
   */
  from(entityName) {
    this._modelName = entityName;
    return this;
  }

  /**
   *
   * @param args
   * @returns {QueryBuilder} Returns this instance.
   */
  where(...args) {
    this._predicate = createPredicate(...args);
    return this;
  }

  /**
   *
   * @param property {String}
   * @returns {QueryBuilder} Returns this instance.
   */
  orderBy(property) {
    this._orderByClause = new OrderByClause(property);
    return this;
  }

  /**
   *
   * @param top {Number}
   * @returns {QueryBuilder} Returns this instance.
   */
  top(top) {
    this._top = +top;
    return this;
  }

  /**
   *
   * @param skip {Number}
   * @returns {QueryBuilder} Returns this instance.
   */
  skip(skip) {
    this._skip = +skip;
    return this;
  }

  /**
   *
   * @returns {QueryBuilder} Returns this instance.
   */
  count() {
    this._isCount = true;
    return this;
  }

  /**
   * Adds properties for expanding.
   * Automatically checks duplications.
   *
   * @param properties {String}
   * @returns {QueryBuilder} Returns this instance.
   */
  expand(properties) {
    properties.split(',').forEach(i => this._expand[i.trim()] = true);
    return this;
  }

  /**
   * Adds attributes for selection.
   * Automatically checks duplications.
   *
   * @param attributes {String}
   * @returns {QueryBuilder} Returns this instance.
   */
  select(attributes) {
    attributes.split(',').forEach(i => this._select[i.trim()] = true);
    return this;
  }

  /**
   * Adds attributes for selection from specified projection.
   * Merges attributes with added using `select`.
   *
   * @param projectionName {String} The name of the projection.
   * @returns {QueryBuilder} Returns this instance.
   */
  selectByProjection(projectionName) {
    this._projectionName = projectionName;
    return this;
  }

  /**
   * Builds query instance using all provided data.
   *
   * @returns {Object} Query instance. TODO: Use special class.
   */
  build() {
    if (!this._modelName) {
      throw new Error('Model name is not specified');
    }

    if (this._projectionName) {
      let typeClass = this._store.modelFor(this._modelName);
      let proj = typeClass.projections.get(this._projectionName);
      let query = getQuery(proj, this._store);

      this.select(query.$select);
      if (query.$expand) {
        query.$expand.forEach(i => this._expand[i.trim()] = true);
      }
    }

    return {
      entity: this._modelName, // TODO: rename
      predicate: this._predicate,
      order: this._orderByClause,
      top: this._top,
      skip: this._skip,
      count: this._isCount,
      expand: Object.keys(this._expand),
      select: Object.keys(this._select)
    };
  }
}

/**
 * Creates predicate by various parameters.
 *
 * @param args Arguments for the predicate.
 * @returns {BasePredicate}
 */
function createPredicate(...args) {
  if (args.length === 1) {
    if (args[0] && args[0] instanceof BasePredicate) {
      return args[0];
    } else {
      throw new Error(`Specified argument is not a predicate`);
    }
  }

  if (args.length === 3) {
    return new SimplePredicate(args[0], args[1], args[2]);
  }

  throw new Error(`Couldn not create predicate from arguments`);
}

/**
 * Converts projection to URL query params for OData v4.
 *
 * @param {Object} projection Model projection to convert.
 * @param {DS.Store} store The store service.
 * @return {Object} Object with $select and $expand properties.
 */
function getQuery(projection, store) {
  var tree = getODataQueryTree(projection, store);
  return getODataQuery(tree);
}

function getODataQueryTree(projection, store) {
  let serializer = store.serializerFor(projection.modelName);
  let tree = {
    select: [serializer.primaryKey],
    expand: {}
  };

  let attributes = projection.attributes;
  for (let attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      let attr = attributes[attrName];
      let normalizedAttrName = serializer.keyForAttribute(attrName);
      switch (attr.kind) {
        case 'attr':
          tree.select.push(normalizedAttrName);
          break;

        case 'hasMany':
        case 'belongsTo':
          tree.select.push(normalizedAttrName);
          tree.expand[normalizedAttrName] = getODataQueryTree(attr, store);
          break;

        default:
          throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }
  }

  return tree;
}

function getODataQuery(queryTree) {
  var query = {};

  var select = getODataSelectQuery(queryTree);
  if (select) {
    query.$select = select;
  }

  var expand = getODataExpandQuery(queryTree);
  if (expand) {
    query.$expand = expand;
  }

  return query;
}

function getODataExpandQuery(queryTree) {
  var expandProperties = Object.keys(queryTree.expand);
  if (!expandProperties.length) {
    return null;
  }

  var query = [];
  expandProperties.forEach(function (propertyName) {
    var subTree = queryTree.expand[propertyName];
    var expr = propertyName;
    var select = getODataSelectQuery(subTree);
    var expand = getODataExpandQuery(subTree);

    if (select || expand) {
      expr += '(';
      if (select) {
        expr += '$select=' + select;
      }

      if (expand) {
        expr += ';' + '$expand=' + expand;
      }

      expr += ')';
    }

    query.push(expr);
  });

  return query;
}

function getODataSelectQuery(queryTree) {
  if (queryTree.select.length) {
    return queryTree.select.join(',');
  } else {
    return null;
  }
}
