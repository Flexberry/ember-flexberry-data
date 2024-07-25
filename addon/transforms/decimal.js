/**
  @module ember-flexberry-data
*/

import { isEmpty } from '@ember/utils';
import { NumberTransform } from '@ember-data/serializer/transform';

/**
  Transformation for model's attributes defined as <a href="http://emberjs.com/api/data/#method_attr">DS.attr</a> with type 'decimal'.
  It extends <a href="http://emberjs.com/api/data/classes/DS.NumberTransform.html">number transformation</a> from ember data.

  @class DecimalTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.NumberTransform.html">DS.NumberTransform</a>
  @example
  ```
  import DS from 'ember-data';
  export default DS.Model.extend({
    name: DS.attr('string'),
    decimalNumber: DS.attr('decimal')
  });
  ```
*/
export default class extends NumberTransform {

  /**
    Deserializes serialized attribute value.
   */
  deserialize(serialized) {
    var des = isEmpty(serialized) ? null : super.deserialize(serialized.toString().replace(',', '.'));
    return des;
  }

  /**
    Serializes deserialized attribute value.
   */
  serialize(deserialized) {
    let ser = isEmpty(deserialized) ? null : super.serialize(deserialized.toString().replace(',', '.'));
    return ser;
  }
};
