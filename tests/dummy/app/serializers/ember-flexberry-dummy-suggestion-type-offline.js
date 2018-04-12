import DS from 'ember-data';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    parent: { serialize: 'id', deserialize: 'records' },
    localizedTypes: { serialize: 'ids', deserialize: 'records' }
  }
});
