import { Serializer } from 'ember-flexberry-data';

export default Serializer.Odata.extend({

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
