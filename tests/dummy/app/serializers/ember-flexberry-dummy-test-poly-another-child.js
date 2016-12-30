import TestPolyBaseSerializer from './ember-flexberry-dummy-test-poly-base';

// TODO: ODataSerializer.extend
export default TestPolyBaseSerializer.extend({
  attrs: {

  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
