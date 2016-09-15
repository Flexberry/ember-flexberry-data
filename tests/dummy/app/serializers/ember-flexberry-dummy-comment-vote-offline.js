import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    applicationUser: { serialize: 'id', deserialize: 'records' },
    comment: { serialize: 'id', deserialize: 'records' }
  }
});
