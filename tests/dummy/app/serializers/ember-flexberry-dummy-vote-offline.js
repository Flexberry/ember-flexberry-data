import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    author: { serialize: 'id', deserialize: 'records' },
    suggestion: { serialize: 'id', deserialize: 'records' }
  }
});
