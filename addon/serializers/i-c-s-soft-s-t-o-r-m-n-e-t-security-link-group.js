import { Serializer as LinkGroupSerializer } from
  '../mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group';
import ODataSerializer from './odata';

export default ODataSerializer.extend(LinkGroupSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
