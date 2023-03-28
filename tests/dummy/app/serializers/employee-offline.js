import DS from 'ember-data';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    Country: { serialize: 'id', deserialize: 'records' },
    Manager: { serialize: 'id', deserialize: 'records' },
    Creator: { serialize: 'id', deserialize: 'records' },
    Tags: { serialize: 'id', deserialize: 'records' },
  },
});
