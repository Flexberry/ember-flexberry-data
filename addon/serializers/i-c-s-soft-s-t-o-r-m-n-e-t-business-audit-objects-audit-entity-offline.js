import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    user: { serialize: 'id', deserialize: 'records' },
    objectType: { serialize: 'id', deserialize: 'records' },
    auditFields: { serialize: 'ids', deserialize: 'records' },
  },
});
