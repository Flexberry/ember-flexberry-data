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
          attributes[key] = hash[attributeKey] === 'true' ? true : false;
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
    if (attribute.type === 'boolean' && typeof value === 'boolean') {
      json[key] = `${value}`;
    } else {
      this._super(snapshot, json, key, attribute);
    }
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
