import Ember from 'ember';
import DS from 'ember-data';

import BaseBuilder from './base-builder';
import OrderByClause from './order-by-clause';
import QueryObject from './query-object';
import { createPredicate, SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import Information from '../utils/information';

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
    let model = this._store.modelFor(this._modelName);

    if (this._projectionName) {
      let projection = model.projections.get(this._projectionName);
      if (!projection) {
        throw new Error(`Projection ${this._projectionName} for model ${this._modelName} is not specified`);
      }

      tree = this._getQueryTreeByProjection(projection, model, this._modelName);
    } else {
      tree = this._getQueryBySelect(this._select, model, this._modelName);
    }

    // Merge, don't replace.
    let uniqSelect = {};
    tree.select.forEach(i => uniqSelect[i] = true);
    let select = Object.keys(uniqSelect);

    let expand = tree.expand;
    let primaryKeyName = tree.primaryKeyName;

    let extendProperties = this._getExtendedProjection(tree);
    let extendTree = this._getQueryBySelect(extendProperties, model, this._modelName);

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
      select,
      primaryKeyName,
      extendTree
    );
  }

  _getQueryBySelect(select, model, modelName) {
    let primaryKeyNameFromSerializer = this._store.serializerFor(modelName).get('primaryKey');
    let primaryKeyName = primaryKeyNameFromSerializer ? primaryKeyNameFromSerializer : 'id';
    let result = {
      select: ['id'],
      expand: {},
      primaryKeyName: primaryKeyName
    };

    let selectProperties = Object.keys(select);

    for (let i = 0; i < selectProperties.length; i++) {
      this._buildQueryForProperty(result, selectProperties[i], model, modelName);
    }

    return result;
  }

  _buildQueryForProperty(data, property, model, modelName) {
    let pathItems = Information.parseAttributePath(property);
    let relationshipsByName = Ember.get(model, 'relationshipsByName');

    if (pathItems.length === 1) {
      let attributeName = pathItems[0];
      let modelAttributes = Ember.get(model, 'attributes');
      if (attributeName === 'id' || modelAttributes.has(attributeName) || relationshipsByName.has(attributeName)) {
        data.select.push(attributeName);
      } else {
        throw new Error(`Property '${attributeName}' in model '${modelName}' is not specified. ` +
        `Please report this info to application support team or developers.`);
      }
    } else {
      let key = pathItems.shift();

      let relationship = relationshipsByName.get(key);
      if (!relationship) {
        throw new Error(`Property '${key}' in model '${modelName}' is not specified. Please report this info to application support team or developers.`);
      }

      let ralatedModelName = relationship.type;
      let relatedModel = this._store.modelFor(ralatedModelName);

      let relationshipProps = {
        async: relationship.options.async,
        isEmbedded: true, // TODO: isEmbedded(this._store, modelName, attrName)
        type: relationship.kind
      };

      let primaryKeyNameFromSerializer = this._store.serializerFor(ralatedModelName).get('primaryKey');
      let primaryKeyName = primaryKeyNameFromSerializer ? primaryKeyNameFromSerializer : 'id';
      data.expand[key] = {
        select: ['id'],
        expand: {},
        modelName: ralatedModelName,
        primaryKeyName: primaryKeyName,
        relationship: relationshipProps
      };

      this._buildQueryForProperty(data.expand[key], pathItems.join('.'), relatedModel, ralatedModelName);
    }
  }

  _getQueryTreeByProjection(projection, model, modelName, relationshipProps) {
    let primaryKeyNameFromSerializer = this._store.serializerFor(modelName).get('primaryKey');
    let primaryKeyName = primaryKeyNameFromSerializer ? primaryKeyNameFromSerializer : 'id';
    let tree = {
      select: ['id'],
      expand: {},
      modelName: modelName,
      primaryKeyName: primaryKeyName,
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

          case 'hasMany':
          case 'belongsTo':
            let relationshipsByName = Ember.get(model, 'relationshipsByName');
            let relationship = relationshipsByName.get(attrName);
            let ralatedModelName = relationship.type;
            let relatedModel = this._store.modelFor(ralatedModelName);

            let relationshipProps = {
              async: relationship.options.async,
              isEmbedded: true, // TODO: isEmbedded(this._store, modelName, attrName)
              type: attr.kind
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

  _getExtendedProjection() {
    let extend = [];
    let existKeys = Object.keys(this._select);
    let scanPredicates = function(predicate, detailPath) {
      if (predicate instanceof SimplePredicate || predicate instanceof StringPredicate) {
        let path = detailPath ? detailPath + '.' : '';
        Information.parseAttributePath(predicate.attributePath).forEach((attribute) => {
          let key = `${path}${attribute}`;
          if (existKeys.indexOf(key) === -1) {
            extend[key.trim()] = true;
          }

          path += `${attribute}.`;
        });
      }

      if (predicate instanceof DetailPredicate) {
        scanPredicates(predicate.predicate, predicate.detailPath);
      }

      if (predicate instanceof ComplexPredicate) {
        predicate.predicates.forEach((innerPredicate) => {
          scanPredicates({ innerPredicate });
        });
      }
    };

    scanPredicates(this._predicate);

    if (this._orderByClause) {
      for (let i = 0; i < this._orderByClause.length; i++) {
        let path = '';
        let attributePath = Information.parseAttributePath(this._orderByClause.attribute(i).name);
        for (let i = 0; i < attributePath.length; i++) {
          let key = `${path}${attributePath[i]}`;
          if (existKeys.indexOf(key) === -1) {
            extend[key.trim()] = true;
          }

          path += `${attributePath[i]}.`;
        }
      }
    }

    return extend;
  }
}
