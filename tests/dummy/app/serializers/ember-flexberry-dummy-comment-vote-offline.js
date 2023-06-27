import DS from 'ember-data';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    applicationUser: { serialize: 'id', deserialize: 'records' },
    comment: { serialize: 'id', deserialize: 'records' }
  }
});
