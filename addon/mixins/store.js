import Ember from 'ember';

/**
 * Mixin for {{#crossLink "DS.Store"}}Store{{/crossLink}} to support
 * fetching models using projection.
 *
 * @module ember-flexberry-projections
 * @namespace DS
 * @class Store
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  /**
   * Finds all records for the given model type.
   *
   * See {{#crossLink "DS.Store/findAll:method"}}{{/crossLink}} for details.
   *
   * @method findAll
   * @public
   *
   * @param {String} modelName The name of the model type.
   * @param {Object} [options] Options.
   * @param {String} options.projection Projection name.
   * @return {DS.AdapterPopulatedRecordArray} Records promise.
   */
  findAll(modelName, options) {
    Ember.Logger.debug(`Store::findAll ${modelName}`);

    if (options && options.projection) {
      Ember.Logger.debug(`Store::findAll using projection '${options.projection}'`);

      return this.query(modelName, {
        projection: options.projection
      });
    }

    return this._super.apply(this, arguments);
  },

  /**
   * Returns a record for a given type and id combination.
   *
   * See {{#crossLink "DS.Store/findRecord:method"}}{{/crossLink}} for details.
   *
   * @method findRecord
   * @public
   *
   * @param {String} modelName The name of the model type.
   * @param {String|Integer} id Record ID.
   * @param {Object} [options] Options.
   * @param {String} options.projection Projection name.
   * @return {Promise} Record promise.
   */
  findRecord(modelName, id, options) {
    Ember.Logger.debug(`Store::findRecord ${modelName}(${id})`);

    if (options && options.projection) {
      Ember.Logger.debug(`Store::Find record using projection '${options.projection}'`);

      // TODO: case of options.reload === false.
      return this.queryRecord(modelName, {
        id: id,
        projection: options.projection
      });
    }

    return this._super.apply(this, arguments);
  }
});
