import Ember from 'ember';

/**
 * @module ember-flexberry-projections
 */

/**
 * Mixin for {{#crossLink "DS.Adapter"}}Adapter{{/crossLink}} to support
 * fetching models using projection.
 *
 * @class Adapter
 * @namespace Projection
 * @extends Ember.Mixin
 * @public
 */
export default Ember.Mixin.create({
  /**
   * Builds a URL for a given type and query.
   * Optionally, it supports an ID in the query parameters for fetching
   * a definite record.
   *
   * See {{#crossLink "DS.BuildURLMixin/urlForQueryRecord:method"}}{{/crossLink}}
   * for details.
   *
   * @method urlForQueryRecord
   * @public
   *
   * @param {Object} query Query parameters.
   * @param {String} [query.id] ID of a record.
   * @param {String} modelName Record type.
   * @return {String} url URL for query a record.
   */
  urlForQueryRecord: function (query, modelName) {
    let id = query.id;
    delete query.id;
    return this._buildURL(modelName, id);
  }
});
