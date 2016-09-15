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
