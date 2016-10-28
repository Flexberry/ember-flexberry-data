/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import NumberTransform from 'ember-data/-private/transforms/number';

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
export default NumberTransform.extend({

  /**
    Deserializes serialized attribute value.
   */
  deserialize(serialized) {
    return Ember.isEmpty(serialized) ? null : this._super(serialized.toString().replace(',', '.'));
  },

  /**
    Serializes deserialized attribute value.
   */
  serialize(deserialized) {
    return Ember.isEmpty(deserialized) ? null : this._super(deserialized.toString().replace(',', '.'));
  }
});
