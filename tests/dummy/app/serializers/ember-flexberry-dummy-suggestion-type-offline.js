import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    parent: { serialize: 'id', deserialize: 'records' },
    localizedTypes: { serialize: 'ids', deserialize: 'records' }
  }
});
