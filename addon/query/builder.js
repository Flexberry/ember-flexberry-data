import DS from 'ember-data';

import BaseBuilder from './base-builder';
import { createPredicate } from './predicate';
import OrderByClause from './order-by-clause';
import QueryObject from './query-object';

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
    this._select = {};
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
      let model = this._store.modelFor(this._modelName);
      let proj = model.projections.get(this._projectionName);
      let tree = this._getQueryTree(proj, this._store);

      // Merge, don't replace.
      tree.select.forEach(i => this._select[i] = true);
      Object.keys(tree.expand).forEach(i => this._expand[i] = tree.expand[i]);
    }

    return new QueryObject(
      this._modelName,
      this._id,
      this._projectionName,
      this._predicate,
      this._orderByClause,
      this._top,
      this._skip,
      this._isCount,
      this._expand,
      Object.keys(this._select)
    );
  }

  _getQueryTree(projection, store) {
    let tree = {
      select: ['id'],
      expand: {}
    };

    let attributes = projection.attributes;
    for (let attrName in attributes) {
      if (attributes.hasOwnProperty(attrName)) {
        let attr = attributes[attrName];
        switch (attr.kind) {
          case 'attr':
            tree.select.push(attrName);
            break;

          case 'hasMany':
          case 'belongsTo':
            tree.select.push(attrName);
            tree.expand[attrName] = this._getQueryTree(attr, store);
            break;

          default:
            throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
        }
      }
    }

    return tree;
  }
}
