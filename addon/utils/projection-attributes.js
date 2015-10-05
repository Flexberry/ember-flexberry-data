import Ember from 'ember';
import Projection from './projection';

/**
 * @module ember-flexberry-projections
 */

/**
 * This class used to define projection attributes for model.
 *
 * @class ProjectionAttributes
 * @public
 */
export default {
  /**
   * Define plain attribute in projection.
   *
   * @method attr
   * @param {String} caption A user-friendly caption for attribute.
   * @param {Object} [options] Attribute options.
   * @return {Object} Projection attribute.
   * @public
   */
  attr: function(caption, options) {
    let attr = createAttr('attr', caption, options);
    return attr;
  },

  /**
   * Define belongsTo relationship attribute in projection.
   *
   * @method belongsTo
   * @param {String} modelName The name of the model type.
   * @param {String} caption A user-friendly caption for attribute.
   * @param {Object} attributes Projection attributes.
   * @param {Object} [options] Attribute options.
   * @return {Object} Projection attribute.
   * @public
   */
  belongsTo: function(modelName, caption, attributes, options) {
    let attr = createAttr('belongsTo', caption, options);
    let proj = Projection.create(modelName, attributes);
    attr = Ember.merge(attr, proj);
    return attr;
  },

  /**
   * Define hasMany relationship attribute in projection.
   *
   * @method hasMany
   * @param {String} modelName The name of the model type.
   * @param {String} caption A user-friendly caption for attribute.
   * @param {Object} attributes Projection attributes.
   * @param {Object} [options] Attribute options.
   * @return {Object} Projection attribute.
   * @public
   */
  hasMany: function(modelName, caption, attributes, options) {
    let attr = createAttr('hasMany', caption, options);
    let proj = Projection.create(modelName, attributes);
    attr = Ember.merge(attr, proj);
    return attr;
  }
};

function createAttr(kind, caption, options) {
  return {
    kind: kind,
    caption: caption,
    options: options || {}
  };
}
