import Ember from 'ember';
import DS from 'ember-data';

import BaseSerializer from './base';

/**
 * Serializer class for OData.
 *
 * @module ember-flexberry-projections
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
    if (Ember.isNone(belongsToId)) {
      json[payloadKey] = null;
    } else {
      json[payloadKey] = Ember.String.pluralize(Ember.String.capitalize(Ember.String.camelize(relationship.type))) + '(' + belongsToId + ')';
    }
  }
});
