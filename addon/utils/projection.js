/**
 * @module ember-flexberry-projections
 */

/**
 * This class used to define projection for model.
 *
 * @class Projection
 * @public
 */
export default {
  /**
   * Creates model projection.
   *
   * @method create
   * @public
   *
   * @param {String} modelName The name of the model type.
   * @param {Object} attributes Projection attributes.
   * @return {Object} Model projection.
   */
  create: function(modelName, attributes) {
    return {
      modelName: modelName,
      attributes: attributes || {}
    };
  }
};
