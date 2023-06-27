/**
  @module ember-flexberry-data
*/

import { isEmpty } from '@ember/utils';
import StringTransform from 'ember-data/transforms/string';

/**
  Transformation for model's attributes defined as <a href="http://emberjs.com/api/data/#method_attr">DS.attr</a> with type 'guid'.
  It extends <a href="http://emberjs.com/api/data/classes/DS.NumberTransform.html">number transformation</a> from ember data.

  @class GuidTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.NumberTransform.html">DS.NumberTransform</a>
  @example
  ```
  import DS from 'ember-data';
  export default DS.Model.extend({
    externalId: DS.attr('guid')
  });
  ```
*/
export default StringTransform.extend({
  /**
    Deserializes serialized attribute value.
   */
  deserialize(serialized) {
    return isEmpty(serialized) ? null : serialized;
  },

  /**
    Serializes deserialized attribute value.
   */
  serialize(deserialized) {
    return isEmpty(deserialized) ? null : deserialized;
  }
});
