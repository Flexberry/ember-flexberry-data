import DS from 'ember-data';

import BaseBuilder from './base-builder';
import { createPredicate } from './predicate';
import OrderByClause from './order-by-clause';

/**
 * Class of builder for query.
 * Uses method chaining.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class Builder
 * @extends BaseBuilder
 */
export default class Builder extends BaseBuilder {
  /**
   * @param store {Store} Store for building query.
   * @param modelName {String} The name of the requested entity.
   * @class Builder
   * @constructor
   */
  constructor(store, modelName) {
    super();

    if (!store || !(store instanceof DS.Store)) {
      throw new Error('Store is not specified');
    }

    this._store = store;
    this._modelName = modelName;

    this._id = null;
    this._projectionName = null;
    this._predicate = null;
    this._orderByClause = null;
    this._isCount = false;
    this._expand = {};
    this._select = [];
  }

  /**
   * Sets the id of the requested entity.
   *
   * @method byId
   * @param id {String|Number} The id of the requested entity.
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  byId(id) {
    this._id = id;
    return this;
  }

  /**
   * Sets the name of the requested entity.
   *
   * @method from
   * @param modelName {String} The name of the requested entity.
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  from(modelName) {
    this._modelName = modelName;
    return this;
  }

  /**
   *
   * @method where
   * @param ...args
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  where(...args) {
    this._predicate = createPredicate(...args);
    return this;
  }

  /**
   *
   * @method orderBy
   * @param property {String}
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  orderBy(property) {
    if (!property) {
      throw new Error('You trying sort by a empty string.');
    }

    this._orderByClause = new OrderByClause(property);
    return this;
  }

  /**
   *
   * @method top
   * @param top {Number}
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  top(top) {
    this._top = +top;
    return this;
  }

  /**
   *
   * @method skip
   * @param skip {Number}
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  skip(skip) {
    this._skip = +skip;
    return this;
  }

  /**
   *
   * @method count
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  count() {
    this._isCount = true;
    return this;
  }

  /**
   * Adds properties for expanding.
   * Automatically checks duplications.
   *
   * @method expand
   * @param properties {String}
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  expand(properties) {
    properties.split(',').forEach(i => this._expand[i.trim()] = true);
    return this;
  }

  /**
   * Adds attributes for selection.
   * Automatically checks duplications.
   *
   * @method select
   * @param attributes {String}
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  select(attributes) {
    attributes.split(',').forEach(i => this._select[i.trim()] = true);
    return this;
  }

  /**
   * Adds attributes for selection from specified projection.
   * Merges attributes with added using `select`.
   *
   * @method selectByProjection
   * @param projectionName {String} The name of the projection.
   * @return {Query.Builder} Returns this instance.
   * @public
   * @chainable
   */
  selectByProjection(projectionName) {
    this._projectionName = projectionName;
    return this;
  }

  /**
   * Builds query instance using all provided data.
   *
   * @method build
   * @return {Object} Query instance.
   * @public
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

    // TODO: Use special class.
    return {
      id: this._id,
      modelName: this._modelName,
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
 * Converts projection to URL query params for OData v4.
 *
 * @method getQuery
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
