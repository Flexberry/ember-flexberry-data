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
 * @param {String} projectionName The name of the projection type.
 * @return {Object} Model projection.
 */
export default function create(modelName, attributes, projectionName) {
  return {
    projectionName: projectionName || undefined,
    modelName,
    attributes: attributes || {}
  };
}
