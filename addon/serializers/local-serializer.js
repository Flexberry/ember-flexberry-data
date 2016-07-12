/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';
import isObject from '../utils/is-object';

/**
  Base serializer for {{#crossLink "LocalStore"}}{{/crossLink}}.

  @class Serializer
  @namespace Offline
  @extends <a href="https://github.com/Flexberry/ember-localforage-adapter/blob/master/addon/serializers/localforage.js">LocalforageSerializer</a>
*/
export default LFSerializer.extend({
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
  }
});
