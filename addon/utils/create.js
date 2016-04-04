/**
 * @module ember-flexberry-projections
 */

/**
 * Creates model projection.
 *
 * @method create
 * @for Projection
 * @public
 *
 * @param {String} modelName The name of the model type.
 * @param {Object} attributes Projection attributes.
 * @return {Object} Model projection.
 */
export default function create(modelName, attributes) {
  return {
    modelName: modelName,
    attributes: attributes || {}
  };
}
