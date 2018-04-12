/**
  @module ember-flexberry-data
*/

import { isNone } from '@ember/utils';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import isObject from '../utils/is-object';

/**
  Base serializer for {{#crossLink "Offline.LocalStore"}}{{/crossLink}}.

  @namespace Serializer
  @class Offline
  @extends <a href="http://emberjs.com/api/data/classes/DS.JSONSerializer.html">JSONSerializer</a>
*/
export default DS.JSONSerializer.extend({
  /*
    Serializer initialization.
  */
  init: function() {
    this._super(...arguments);
    let owner = getOwner(this);
    let localStore = owner.lookup('store:local');
    this.set('store', localStore);
  },

  /**
    Returns the resource's attributes formatted as a JSON-API "attributes object".
    [More info](http://emberjs.com/api/data/classes/DS.JSONSerializer.html#method_extractAttributes).

    @method extractAttributes
    @param {Object} model
    @param {Object} hash
    @return {Object}
  */
  extractAttributes(model, hash) {
    let attributes = this._super(...arguments);
    model.eachAttribute((key, { type }) => {
      if (type === 'boolean') {
        let attributeKey = this.keyForAttribute ? this.keyForAttribute(key, 'deserialize') : key;
        if (typeof hash[attributeKey] === 'string') {
          attributes[key] = hash[attributeKey] === 'true' ? true : hash[attributeKey] === null ? null : false;
        }
      }
    });

    return attributes;
  },

  /**
    Method `serializeAttribute` can be used to customize how DS.attr properties are serialized.
    [More info](http://emberjs.com/api/data/classes/DS.JSONSerializer.html#method_serializeAttribute).

    @method serializeAttribute
    @param {DS.Snapshot} snapshot
    @param {Object} json
    @param {String} key
    @param {Object} attribute
  */
  serializeAttribute(snapshot, json, key, attribute) {
    let attributeKey = this.keyForAttribute ? this.keyForAttribute(key, 'serialize') : key;

    let value = snapshot.attr(key);
    switch (attribute.type) {
      case 'boolean':
        if (typeof value === 'boolean') {
          json[attributeKey] = `${value}`;
        } else if (typeof value === 'undefined') {
          json[attributeKey] = 'false';
        } else {
          this._super(...arguments);
        }

        break;

      case 'decimal':

        //Value should be a decimal number
        if (typeof value === 'string') {
          value = +(value.replace(',', '.'));
        }

        if (isFinite(value) || typeof value === 'undefined') {
          this._super(...arguments);
        } else {
          throw new Error(`Trying to save '${value}' value of '${key}' field of '${snapshot.modelName}' that should be a decimal`);
        }

        break;

      case 'number':

        //Value should be a number
        if (typeof value === 'string') {
          value = +value;
        }

        if (isFinite(value) || typeof value === 'undefined') {
          this._super(...arguments);
        } else {
          throw new Error(`Trying to save '${value}' value of '${key}' field of '${snapshot.modelName}' that should be a number`);
        }

        break;

      default:
        this._super(...arguments);
    }

  },

  serializePolymorphicType: function(snapshot, json, relationship) {
    let key = relationship.key;
    let belongsTo = snapshot.belongsTo(key);
    key = this.keyForAttribute ? this.keyForAttribute(key, 'serialize') : key;

    if (isNone(belongsTo)) {
      json['_' + key + '_type'] = null;
    } else {
      json['_' + key + '_type'] = belongsTo.modelName;
    }
  },

  /**
    Normalization method for arrays of objects.
    [More info](http://emberjs.com/api/data/classes/DS.JSONSerializer.html#method_normalizeArrayResponse).

    @method normalizeArrayResponse
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} payload
    @return {Object}
  */
  normalizeArrayResponse(store, type, payload) {
    if (isArray(payload)) {
      payload = { data: payload };
    }

    payload.included = [];
    payload.data = payload.data.map((item) => {
      let normalize = this.normalize(type, item);
      if (normalize.included) {
        normalize.included.forEach((i) => { payload.included.push(i); });
      }

      return normalize.data;
    });
    return payload;
  },

  /*
    Returns a relationship formatted as a JSON-API "relationship object".
    See http://jsonapi.org/format/#document-resource-object-relationships
  */
  extractRelationship(relationshipModelName, relationshipHash) {
    if (isObject(relationshipHash) && isNone(relationshipHash.type)) {
      relationshipHash.type = relationshipModelName;
    } else if (!isObject(relationshipHash) && !isNone(relationshipHash)) {
      var hash = {
        id: relationshipHash,
        type: relationshipModelName
      };

      relationshipHash = hash;
    }

    return relationshipHash;
  },

  /*
    Returns a polymorphic relationship formatted as a JSON-API "relationship object".
    See http://jsonapi.org/format/#document-resource-object-relationships
  */
  extractPolymorphicRelationship(relationshipModelName, relationshipHash, relationshipOptions) {
    let key = relationshipOptions.key ? relationshipOptions.key : relationshipOptions.relationshipKey;
    let typeField = '_' + key + '_type';
    if (relationshipOptions.resourceHash.hasOwnProperty(typeField)) {
      relationshipHash.type = relationshipOptions.resourceHash[typeField];
      delete relationshipOptions.resourceHash[typeField];
    } else {
      relationshipHash.type = relationshipModelName;
    }

    return relationshipHash;
  },

  /*
    Check if the given hasMany relationship should be serialized.
  */
  _shouldSerializeHasMany(snapshot, key, relationship) {
    const relationshipType = snapshot.type.determineRelationshipType(relationship, this.store);

    if (this._mustSerialize(key)) {
      return true;
    }

    return this._canSerialize(key) &&
      (relationshipType === 'manyToNone' ||
        relationshipType === 'manyToMany' ||
        relationshipType === 'manyToOne');
  }
});
