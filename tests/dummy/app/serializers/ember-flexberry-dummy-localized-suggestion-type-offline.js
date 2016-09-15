import DS from 'ember-data';
import { Serializer } from 'ember-flexberry-data';

export default Serializer.Offline.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    localization: { serialize: 'id', deserialize: 'records' },
    suggestionType: { serialize: 'id', deserialize: 'records' }
  }
});
