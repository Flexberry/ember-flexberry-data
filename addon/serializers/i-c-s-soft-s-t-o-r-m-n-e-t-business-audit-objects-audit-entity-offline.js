import DS from 'ember-data';
import OfflineSerializer from './offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    user: { serialize: 'id', deserialize: 'records' },
    objectType: { serialize: 'id', deserialize: 'records' },
    auditFields: { serialize: 'ids', deserialize: 'records' },
  },
});
