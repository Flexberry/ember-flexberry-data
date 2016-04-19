import Ember from 'ember';
import DS from 'ember-data';
import createProj from '../utils/create';

/**
 * @module ember-flexberry-projections
 */

/**
 * Model that supports projections.
 *
 * @class Model
 * @namespace Projection
 * @extends DS.Model
 * @public
 */
var Model = DS.Model.extend({
});

Model.reopenClass({
  /**
   * Defined projections for current model type.
   *
   * @property projections
   * @public
   * @static
   * @type Ember.Object
   * @default null
   */
  projections: null,

  /**
   * Defines projection for specified model type.
   *
   * @method defineProjection
   * @public
   * @static
   *
   * @param {String} projectionName Projection name, eg 'EmployeeE'.
   * @param {String} modelName The name of the model type.
   * @param {Object} attributes Projection attributes.
   * @return {Object} Created projection.
   */
  defineProjection: function (projectionName, modelName, attributes) {
    let proj = createProj(modelName, attributes);

    if (!this.projections) {
      this.reopenClass({
        projections: Ember.Object.create()
      });
    }

    this.projections.set(projectionName, proj);
    return proj;
  }
});

export default Model;
