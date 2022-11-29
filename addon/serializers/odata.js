import { isNone } from '@ember/utils';
import { get } from '@ember/object';
import DS from 'ember-data';

import BaseSerializer from './base';
import { capitalize, camelize, odataPluralize } from '../utils/string-functions';

/**
 * Serializer class for OData.
 *
 * @module ember-flexberry-data
 * @class OData
 */
export default BaseSerializer.extend(DS.EmbeddedRecordsMixin, {
  /**
   * `serializeBelongsTo` can be used to customize how `DS.belongsTo` properties are serialized.
   * If there is set option `odata-id` at serializer and `DS.belongsTo` property is not null,
   * then property will be serialized like:
   * ```
   * RelationName@odata.bind': RelationType(RelatedObjectId)
   * ```
   *
   * @method serializeBelongsTo
   * @param {DS.Snapshot} snapshot
   * @param {Object} json
   * @param {Object} relationship
   */
  serializeBelongsTo(snapshot, json, relationship) {
    let option = this.attrsOption(relationship.key);
    if (!option || option.serialize !== 'odata-id') {
      this._super(snapshot, json, relationship);
      return;
    }

    let key = relationship.key;
    let belongsToId = snapshot.belongsTo(key, { id: true });
    if (belongsToId === undefined) {
      return;
    }

    let payloadKey = this.keyForRelationship(key, relationship.kind, 'serialize');
    if (isNone(belongsToId)) {
      json[payloadKey] = null;
    } else {
      json[payloadKey] = odataPluralize(capitalize(camelize(relationship.type))) + '(' + belongsToId + ')';
    }

    if (relationship.options.polymorphic) {
      this.serializePolymorphicType(snapshot, json, relationship);
    }
  },

  /**
    * Returns key for a given relationship.
    *
    * @param key Existing relationship key.
    * @returns {string} Key for a given relationship.
   */
  keyForRelationship(key, typeClass, method) {
    if ((method === 'serialize' && this.hasSerializeRecordsOption(key)) ||
    (method === 'deserialize' && this.hasDeserializeRecordsOption(key))) {
      return this.keyForAttribute(key, method);
    } else {
      return capitalize(key) + '@odata.bind';
    }
  },

  /**
    Fixes error with hasMany polymorphic relationships.
    Delete this after ember-data 3.5.0 update.

    @method _normalizeEmbeddedRelationship
    @private
  */
  /* eslint-disable no-unused-vars */
  _normalizeEmbeddedRelationship(store, relationshipMeta, relationshipHash) {
    if (relationshipMeta.kind === 'hasMany' && get(relationshipMeta, 'options.polymorphic')) {
      relationshipHash = this.extractPolymorphicRelationship(undefined, relationshipHash);
    }

    return this._super(...arguments);
  }
  /* eslint-enable no-unused-vars */
});
