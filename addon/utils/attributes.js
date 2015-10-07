import Ember from 'ember';
import createProj from './create';

/**
 * @module ember-flexberry-projections
 */

/**
 * Define plain attribute in projection.
 *
 * @method attr
 * @for Projection
 * @public
 *
 * @param {String} caption A user-friendly caption for attribute.
 * @param {Object} [options] Attribute options.
 * @return {Object} Projection attribute.
 */
export function attr(caption, options) {
  let attribute = createAttr('attr', caption, options);
  return attribute;
}

/**
 * Define belongsTo relationship attribute in projection.
 *
 * @method belongsTo
 * @for Projection
 * @public
 *
 * @param {String} modelName The name of the model type.
 * @param {String} caption A user-friendly caption for attribute.
 * @param {Object} attributes Projection attributes.
 * @param {Object} [options] Attribute options.
 * @return {Object} Projection attribute.
 */
export function belongsTo(modelName, caption, attributes, options) {
  let attr = createAttr('belongsTo', caption, options);
  let proj = createProj(modelName, attributes);
  attr = Ember.merge(attr, proj);
  return attr;
}

/**
 * Define hasMany relationship attribute in projection.
 *
 * @method hasMany
 * @for Projection
 * @public
 *
 * @param {String} modelName The name of the model type.
 * @param {String} caption A user-friendly caption for attribute.
 * @param {Object} attributes Projection attributes.
 * @param {Object} [options] Attribute options.
 * @return {Object} Projection attribute.
 */
export function hasMany(modelName, caption, attributes, options) {
  let attr = createAttr('hasMany', caption, options);
  let proj = createProj(modelName, attributes);
  attr = Ember.merge(attr, proj);
  return attr;
}

function createAttr(kind, caption, options) {
  return {
    kind: kind,
    caption: caption,
    options: options || {}
  };
}
