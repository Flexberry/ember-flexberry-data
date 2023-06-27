/**
  @module ember-flexberry-data
*/

import StringTransform from 'ember-data/transforms/string';

/**
  Transformation for model's attributes defined as <a href="http://emberjs.com/api/data/#method_attr">DS.attr</a> with type 'file'.
  Transformation is necessary in order to detach file attributes from another string attributes on model level.
  It extends <a href="http://emberjs.com/api/data/classes/DS.StringTransform.html">string transformation</a> from ember data,
  without any changes.

  @class FileTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.StringTransform.html">DS.StringTransform</a>
  @example
  ```
  import DS from 'ember-data';
  export default DS.Model.extend({
    name: DS.attr('string'),
    attachment: DS.attr('file')
  });
  ```
*/
export default StringTransform.extend({
  /**
    Deserializes serialized attribute value.
  */
  /* eslint-disable no-unused-vars */
    deserialize(serialized) {
    return this._super(...arguments);
  },

  /**
    Serializes deserialized attribute value.
  */
    serialize(deserialized) {
    return this._super(...arguments);
  }
  /* eslint-enable no-unused-vars */
});
