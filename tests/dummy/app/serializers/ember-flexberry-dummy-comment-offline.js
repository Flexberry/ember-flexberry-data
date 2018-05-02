import DS from 'ember-data';
import OfflineSerializer from 'ember-flexberry-data/serializers/offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    author: { serialize: 'id', deserialize: 'records' },
    suggestion: { serialize: 'id', deserialize: 'records' },
    userVotes: { serialize: 'ids', deserialize: 'records' }
  }
});
