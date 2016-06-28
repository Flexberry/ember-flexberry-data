/**
 * @module ember-flexberry-data
 */

/**
 * Creates model projection.
 *
 * @method create
 * @for DS.Projection
 * @public
 *
 * @param {String} modelName The name of the model type.
 * @param {Object} attributes Projection attributes.
 * @return {Object} Model projection.
 */
export default function create(projectionName, modelName, attributes) {
  return {
    projectionName,
    modelName,
    attributes: attributes || {}
  };
}
