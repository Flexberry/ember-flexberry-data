import Ember from 'ember';

import QueryBuilder from '../query/builder';

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
    Ember.Logger.debug(`Flexberry Store::findAll ${modelName}`);

    let builder = new QueryBuilder(this, modelName);

    if (options && options.projection) {
      Ember.Logger.debug(`Flexberry Store::findAll using projection '${options.projection}'`);

      builder.selectByProjection(options.projection);
    }

    return this.query(modelName, builder.build());
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
    Ember.Logger.debug(`Flexberry Store::findRecord ${modelName}(${id})`);

    let builder = new QueryBuilder(this, modelName).byId(id);

    if (options && options.projection) {
      Ember.Logger.debug(`Flexberry Store::findRecord using projection '${options.projection}'`);

      builder.selectByProjection(options.projection);
    }

    return this.queryRecord(modelName, builder.build());
  },

  /**
   *
   * @method query
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  query(modelName, query) {
    Ember.Logger.debug(`Flexberry Store::query ${modelName}`, query);

    return this._super.apply(this, arguments);
  },

  /**
   *
   * @method queryRecord
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  queryRecord(modelName, query) {
    Ember.Logger.debug(`Flexberry Store::queryRecord ${modelName}`, query);

    return this._super.apply(this, arguments);
  }
});
