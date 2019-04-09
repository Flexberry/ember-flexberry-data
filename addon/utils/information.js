import Ember from 'ember';
import DS from 'ember-data';

import FlexberryEnum from '../transforms/flexberry-enum';

/**
 * Class for loading metadata about models.
 *
 * @module ember-flexberry-data
 * @namespace Utils
 * @class Information
 *
 * @param {DS.Store} store Store for loading metadata.
 * @constructor
 */
class Information {
  constructor(store) {
    if (!store || !(store instanceof DS.Store)) {
      throw new Error('Store is required.');
    }

    this._store = store;
  }

  /**
   Checks if the specified attribute path is exist.

   @method isExist
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is exist.
   @public
   */
  isExist(modelName, attributePath) {
    try {
      // TODO: won't work with cache
      this.getMeta(modelName, attributePath);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   Checks if the specified attribute path is an attribute.

   @method isAttribute
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is an attribute.
   @public
   */
  isAttribute(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return !meta.isMaster && !meta.isDetail;
  }

  /**
   Checks if the specified attribute path is a key (i.e. it is an id or belongsTo relationship).

   @method isKey
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is a key.
   @public
   */
  isKey(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isKey;
  }

  /**
   Checks if the specified attribute path is a relationship.

   @method isRelationship
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is a relationship.
   @public
   */
  isRelationship(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isMaster || meta.isDetail;
  }

  /**
   Checks if the specified attribute path is a master field.

   @method isMaster
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is a master field.
   @public
   */
  isMaster(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isMaster;
  }

  /**
   Checks if the specified attribute path is a detail field.

   @method isDetail
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is a detail field.
   @public
   */
  isDetail(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isDetail;
  }

  /**
   Checks if the specified attribute path is a order field.

   @method isDetail
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is a detail field.
   @public
   */
  isOrder(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isOrder;
  }

  /**
   Returns the type of the specified attribute path.

   @method getType
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {String} The type of the specified attribute path.
   @public
   */
  getType(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.type;
  }

  _loadModel(modelName) {
    let model = this._store.modelFor(modelName);
    if (!model) {
      throw new Error(`Undefined model '${modelName}'.`);
    }

    return model;
  }

  getMeta(modelName, attributePath) {
    let model = this._loadModel(modelName);
    let fields = Information.parseAttributePath(attributePath);

    for (let i = 0; i < fields.length; i++) {
      if (fields.length - 1 === i) {
        let attributes = Ember.get(model, 'attributes');
        if (!attributes) {
          throw new Error(`Attributes not found at model '${modelName}'.`);
        }

        let attribute = attributes.get(fields[i]);
        if (attribute) {
          let transform = Ember.getOwner(this._store).lookup('transform:' + attribute.type);
          let order = Ember.isNone(attribute.options) ? false : attribute.options.order;
          return {
            isMaster: false,
            isDetail: false,
            isKey: false,
            isEnum: transform instanceof FlexberryEnum,
            isOrder: order || false,
            sourceType: transform.get('sourceType'),
            type: attribute.type
          };
        }

        let relationships = Ember.get(model, 'relationshipsByName');
        let relationship = relationships.get(fields[i]);
        if (relationship) {
          let isMaster = relationship.kind === 'belongsTo';
          let isDetail = relationship.kind === 'hasMany';
          return {
            isMaster: isMaster,
            isDetail: isDetail,
            isKey: isMaster,
            isEnum: false,
            isOrder: false,
            type: relationship.type,
            keyType: model.idType || 'guid'
          };
        }

        if (fields[i] === 'id') {
          return {
            isMaster: false,
            isDetail: false,
            isKey: true,
            isEnum: false,
            isOrder: false,
            type: 'string',
            keyType: model.idType || 'guid'
          };
        }

        throw new Error(`Field '${attributePath}' not found at model '${modelName}'.`);
      } else {
        let relationships = Ember.get(model, 'relationshipsByName');
        let relationship = relationships.get(fields[i]);
        if (relationship) {
          model = this._store.modelFor(relationship.type);
          if (!model) {
            throw new Error(`Undefined model '${modelName}'.`);
          }

          continue;
        } else {
          throw new Error(`Field '${attributePath}' not found at model '${modelName}'.`);
        }
      }
    }
  }
}

/**
 Parses the specified attribute paths and returns list of separate attributes.

 @method parseAttributePath
 @param {String} attributePath The path to the attribute.
 @returns {Array} List of separate attributes.
 @public
 @static
 */
Information.parseAttributePath = (attributePath) => attributePath.split('.');

export default Information;
