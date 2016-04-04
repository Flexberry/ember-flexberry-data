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
 * @param {String} projectionName The name of projection.
 * @param {String} modelName The name of the model type.
 * @param {Object} attributes Projection attributes.
 * @return {Object} Model projection.
 */
export default function create(projectionName, modelName, attributes) {
  return {
    projectionName: projectionName,
    modelName: modelName,
    attributes: attributes || {}
  };
}
