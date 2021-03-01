import { merge } from '@ember/polyfills';
import DS from 'ember-data';
import { singularize } from 'ember-inflector';
import { capitalize, camelize, dasherize } from '../utils/string-functions';
import { pluralize } from 'ember-inflector';

/**
 * Base serializer class.
 *
 * @module ember-flexberry-data
 * @class Base
 */
export default DS.RESTSerializer.extend({
  /**
   * Flag: indicates whether to use new {@link http://jsonapi.org|JSON API} serialization.
   */
  isNewSerializerAPI: true,

  /**
   * Prefix for response metadata properties names.
   */
  metaPropertiesPrefix: '@odata.',

  /**
   * Normalization method for single objects.
   *
   * @param store Storage.
   * @param typeClass Type of received object.
   * @param payload Received object itself.
   * @param id Identifier of received object.
   * @returns {object} Valid {@link http://jsonapi.org/format/#document-top-level|JSON API document}.
   */
  normalizeSingleResponse(store, typeClass, payload, id) {
    payload = {
      [typeClass.modelName]: payload
    };

    // Meta should exist in the root of the payload object, otherwise it would not be extracted by _super method.
    this._moveMeta(payload, payload[typeClass.modelName], true);

    return this._super(store, typeClass, payload, id);
  },

  /**
   * Normalization method for arrays of objects.
   *
   * @param store Storage.
   * @param typeClass Type of received object.
   * @param payload Received objects array.
   * @returns {object} Valid {http://jsonapi.org/format/#document-top-level|@link JSON API document}.
   */
  normalizeArrayResponse(store, typeClass, payload) {
    let rootKey = pluralize(typeClass.modelName);
    payload[rootKey] = payload.value;
    delete payload.value;

    return this._super(store, typeClass, payload);
  },

  /**
   * Normalization method for objects.
   *
   * @param typeClass Type of received object.
   * @param hash Target hash.
   * @returns {object} Valid {http://jsonapi.org/format/#document-top-level|@link JSON API document}.
   */
  normalize(typeClass, hash) {
    let odataType = this.get('metaPropertiesPrefix') + 'type';

    if (hash.hasOwnProperty(`${odataType}`)) {
      let hashModel = this.modelNameFromPayloadKey(hash[odataType]);
      if (hashModel !== typeClass.modelName) {
        let newTypeClass = this.store.modelFor(hashModel);
        return this._super(newTypeClass, hash);
      }
    }

    return this._super(typeClass, hash);
  },

  /**
   * Extracts metadata from received object.
   *
   * @param store Storage.
   * @param type Type of received object.
   * @param payload Received object itself.
   * @returns {object} Metadata extracted from received object (any format is allowed).
   */
  extractMeta(store, type, payload) {
    if (!payload) {
      return undefined;
    }

    let meta = {};
    this._moveMeta(meta, payload, false);

    return meta;
  },

  /**
   * Returns key for a given attribute.
   *
   * @param attr Attribute.
   * @returns {string} Key for a given attribute.
   */
  keyForAttribute(attr) {
    return capitalize(attr);
  },

  /**
   * Returns key for a given relationship.
   *
   * @param key Existing relationship key.
   * @param relationship Relationship.
   * @returns {string} Key for a given relationship.
   */
  /* eslint-disable no-unused-vars */
  keyForRelationship(key, relationship) {
    return capitalize(key) + '@odata.bind';
  },
  /* eslint-enable no-unused-vars */

  /**
    Return model name for relationship.

    @method modelNameFromRelationshipType
    @param {String} relationshipType Type of relationship (`relationship.type`).
   */
  modelNameFromRelationshipType(relationshipType) {
    return capitalize(camelize(relationshipType));
  },

  /**
   * Serialization method to serialize record into hash.
   *
   * @param hash Target hash.
   * @param type Record type.
   * @param record Record itself.
   * @param options Serialization options.
   */
  serializeIntoHash(hash, type, record, options) {
    // OData requires id in request body.
    options = options || {};
    options.includeId = true;

    // {...} instead of {"application": {...}}
    merge(hash, this.serialize(record, options));
  },

  /**
    You can use this method to customize how polymorphic objects are serialized.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#method_serializePolymorphicType).

    @method serializePolymorphicType
    @param {DS.Snapshot} snapshot
    @param {Object} json
    @param {Object} relationship
   */
  serializePolymorphicType(snapshot, json, relationship) {
    let belongsTo = snapshot.belongsTo(relationship.key);
    if (belongsTo) {
      let payloadKey = this.keyForRelationship(relationship.key, relationship.kind, 'serialize');
      json[payloadKey] = pluralize(this.modelNameFromRelationshipType(belongsTo.modelName)) + '(' + belongsTo.id + ')';
    }
  },

  /**
    You can use this method to customize how a polymorphic relationship should be extracted.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#method_extractPolymorphicRelationship).

    @method extractPolymorphicRelationship
    @param {String} relationshipType
    @param {Object} relationshipHash
    @return {Object}
   */
  extractPolymorphicRelationship(relationshipType, relationshipHash) {
    let odataType = this.get('metaPropertiesPrefix') + 'type';
    if (relationshipHash.hasOwnProperty(odataType)) {
      relationshipHash.type = this.modelNameFromPayloadKey(relationshipHash[odataType]);
    } else {
      relationshipHash.type = relationshipType;
    }

    return relationshipHash;
  },

  /**
    This method is used to convert each JSON root key in the payload into a modelName that it can use to look up the appropriate model for that part of the payload.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#method_modelNameFromPayloadKey).

    @method modelNameFromPayloadKey
    @param {String} key
    @return {String}
  */
  modelNameFromPayloadKey(key) {
    /* eslint-disable no-useless-escape */
    return singularize(dasherize(key.replace(/[#\.]/g, '')));
    /* eslint-enable no-useless-escape */
  },

  /**
   * Moves metadata from one object to another.
   *
   * @param dest Destination object.
   * @param src Source object.
   * @param withPrefix Flag: indicates whether to include metadata prefixes into properties names or not.
   * @private
   */
  _moveMeta(dest, src, withPrefix) {
    let prefix = this.get('metaPropertiesPrefix');
    let prefixLength = prefix.length;

    for (var srcKey in src) {
      if (src.hasOwnProperty(srcKey) && srcKey.indexOf(prefix) === 0) {
        var destKey = withPrefix ? srcKey : srcKey.substring(prefixLength);
        dest[destKey] = src[srcKey];
        delete src[srcKey];
      }
    }
  }
});
