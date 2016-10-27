/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
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
    let owner = Ember.getOwner(this);
    let localStore = owner.lookup('store:local');
    this.set('store', localStore);
  },

  /**
    Returns the resource's attributes formatted as a JSON-API "attributes object".
    [More info](http://emberjs.com/api/data/classes/DS.JSONSerializer.html#method_extractAttributes).

    @method extractAttributes
    @param {DS.Model} model
    @param {Object} hash
    @return {Object}
  */
  extractAttributes(model, hash) {
    let attributes = this._super(...arguments);
    model.eachAttribute((key, { type }) => {
      if (type === 'boolean') {
        let attributeKey = this.keyForAttribute(key, 'deserialize');
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
    let value = snapshot.attr(key);
    switch (attribute.type) {
      case 'boolean':
        if (typeof value === 'boolean') {
          json[key] = `${value}`;
        } else if (typeof value === 'undefined') {
          json[key] = 'false';
        } else {
          this._super(snapshot, json, key, attribute);
        }

        break;

      case 'decimal':

        //Value should be a decimal number
        if (typeof value === 'string') {
          value = +(value.replace(',', '.'));
        }

        if (isFinite(value) || typeof value === 'undefined') {
          this._super(snapshot, json, key, attribute);
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
          this._super(snapshot, json, key, attribute);
        } else {
          throw new Error(`Trying to save '${value}' value of '${key}' field of '${snapshot.modelName}' that should be a number`);
        }

        break;

      default:
        this._super(snapshot, json, key, attribute);
    }

  },

  serializePolymorphicType: function(snapshot, json, relationship) {
    let key = relationship.key;
    let belongsTo = snapshot.belongsTo(key);
    key = this.keyForAttribute ? this.keyForAttribute(key, 'serialize') : key;

    if (Ember.isNone(belongsTo)) {
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
    if (Ember.isArray(payload)) {
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
    if (isObject(relationshipHash) && Ember.isNone(relationshipHash.type)) {
      relationshipHash.type = relationshipModelName;
    } else if (!isObject(relationshipHash) && !Ember.isNone(relationshipHash)) {
      var hash = {
        id: relationshipHash,
        type: relationshipModelName
      };

      relationshipHash = hash;
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
