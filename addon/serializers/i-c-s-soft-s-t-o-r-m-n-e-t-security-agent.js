import { Serializer as AgentSerializer } from
  '../mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent';
import ODataSerializer from './odata';

export default ODataSerializer.extend(AgentSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
