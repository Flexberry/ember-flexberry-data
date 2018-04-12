import { isNone } from '@ember/utils';
import DS from 'ember-data';

import BaseSerializer from './base';
import { capitalize, camelize } from '../utils/string-functions';
import { pluralize } from 'ember-inflector';

/**
 * Serializer class for OData.
 *
 * @module ember-flexberry-data
 * @namespace Serializer
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
    var option = this.attrsOption(relationship.key);
    if (!option || option.serialize !== 'odata-id') {
      this._super(snapshot, json, relationship);
      return;
    }

    var key = relationship.key;
    var belongsToId = snapshot.belongsTo(key, { id: true });
    var payloadKey = this.keyForRelationship(key, relationship.kind, 'serialize');
    if (isNone(belongsToId)) {
      json[payloadKey] = null;
    } else {
      json[payloadKey] = pluralize(capitalize(camelize(relationship.type))) + '(' + belongsToId + ')';
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
});
