import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    Country: { serialize: 'id', deserialize: 'records' },
    Manager: { serialize: 'id', deserialize: 'records' },
    Creator: { serialize: 'id', deserialize: 'records' },
    Tags: { serialize: 'id', deserialize: 'records' },
  },
});
