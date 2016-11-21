import Ember from 'ember';
import DS from 'ember-data';

import BaseBuilder from './base-builder';
import OrderByClause from './order-by-clause';
import QueryObject from './query-object';
import { createPredicate } from './predicate';
import Information from '../utils/information';
import isEmbedded from '../utils/is-embedded';

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

    let tree;
    if (this._projectionName) {
      let model = this._store.modelFor(this._modelName);
      let projection = model.projections.get(this._projectionName);
      if (!projection) {
        throw new Error(`Projection ${this._projectionName} for model ${this._modelName} is not specified`);
      }

      tree = this._getQueryTreeByProjection(projection, model, this._modelName);
    } else {
      tree = this._getQueryBySelect(); // TODO: support query metadata like _getQueryTreeByProjection.
    }

    // Merge, don't replace.
    let uniqSelect = {};
    tree.select.forEach(i => uniqSelect[i] = true);
    let select = Object.keys(uniqSelect);

    let expand = tree.expand;

    return new QueryObject(
      this._modelName,
      this._id,
      this._projectionName,
      this._predicate,
      this._orderByClause,
      this._top,
      this._skip,
      this._isCount,
      expand,
      select
    );
  }

  _getQueryBySelect() {
    let result = {
      select: ['id'],
      expand: {}
    };

    let selectProperties = Object.keys(this._select);

    for (let i = 0; i < selectProperties.length; i++) {
      this._buildQueryForProperty(result, selectProperties[i]);
    }

    return result;
  }

  _buildQueryForProperty(data, property) {
    let pathItems = Information.parseAttributePath(property);

    if (pathItems.length === 1) {
      data.select.push(pathItems[0]);
    } else {
      let key = pathItems.shift();

      data.expand[key] = {
        select: ['id'],
        expand: {}
      };

      this._buildQueryForProperty(data.expand[key], pathItems.join('.'));
    }
  }

  _getQueryTreeByProjection(projection, model, modelName, relationshipProps) {
    let primaryKeyNameFromSerializer = this._store.serializerFor(modelName).get('primaryKey');
    let tree = {
      select: ['id'],
      expand: {},
      modelName: modelName,
      primaryKeyName: primaryKeyNameFromSerializer ? primaryKeyNameFromSerializer : 'id',
      relationship: relationshipProps
    };

    let attributes = projection.attributes;
    for (let attrName in attributes) {
      if (attributes.hasOwnProperty(attrName)) {
        let attr = attributes[attrName];
        switch (attr.kind) {
          case 'attr':
            tree.select.push(attrName);
            break;

          case 'hasMany': // TODO: Check hasMany relations metadata.
          case 'belongsTo':
            let relationshipsByName = Ember.get(model, 'relationshipsByName');
            let relationship = relationshipsByName.get(attrName);
            let relatedModel = this._store.modelFor(relationship.type);
            let ralatedModelName = relationship.type;

            let relationshipProps = {
              async: relationship.options.async,
              isEmbedded: true // TODO: isEmbedded(this._store, modelName, attrName)
            };
            tree.select.push(attrName);
            tree.expand[attrName] = this._getQueryTreeByProjection(attr, relatedModel, ralatedModelName, relationshipProps);
            break;

          default:
            throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
        }
      }
    }

    return tree;
  }
}
