import DS from 'ember-data';
import OfflineSerializer from './offline';

export default OfflineSerializer.extend(DS.EmbeddedRecordsMixin);
