import Ember from 'ember';
import DS from 'ember-data';

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
   Checks if the specified attribute path is a master field.

   @method isMaster
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} True if the specified attribute path is master field.
   @public
   */
  isMaster(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.isMaster;
  }

  /**
   Returns the type of the specified attribute path.

   @method getType
   @param {String} modelName The name of the model.
   @param {String} attributePath The path to the attribute.
   @returns {Boolean} The type of the specified attribute path.
   @public
   */
  getType(modelName, attributePath) {
    let meta = this.getMeta(modelName, attributePath);
    return meta.type;
  }

  _forEachAttribute(modelName, attributePath, callback) {
    let model = this._loadModel(modelName);
    let fields = Information.parseAttributePath(attributePath);

    for (let i = 0; i < fields.length; i++) {
      if (fields.length - 1 === i) {
        let attributes = Ember.get(model, 'attributes');
        let attribute = attributes.get(fields[i]);
        if (attribute) {
          callback(i, fields.length, fields[i], model, 'attribute');
        }

        let relationships = Ember.get(model, 'relationshipsByName');
        let relationship = relationships.get(fields[i]);
        if (relationship) {
          callback(i, fields.length, fields[i], model, 'relationship');
        }

        throw new Error(`Field '${attributePath}' not found at model '${modelName}'.`);
      } else {
        let relationships = Ember.get(model, 'relationshipsByName');
        let relationship = relationships.get(fields[i]);
        if (relationship) {
          callback(i, fields.length, fields[i], model, 'relationship');

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

    return fields.join('.');
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
      // console.log(fields[i]);
      if (fields.length - 1 === i) {
        let attributes = Ember.get(model, 'attributes');
        let attribute = attributes.get(fields[i]);
        if (attribute) {
          return { isMaster: false, isKey: false, type: attribute.type };
        }

        let relationships = Ember.get(model, 'relationshipsByName');
        let relationship = relationships.get(fields[i]);
        if (relationship) {
          return { isMaster: true, isKey: true, type: relationship.type, keyType: 'guid' }; // TODO: other key types
        }

        if (fields[i] === 'id') {
          return { isMaster: false, isKey: true, type: 'string', keyType: 'guid' }; // TODO: other key types
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
