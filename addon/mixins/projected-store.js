import Ember from 'ember';
import ProjectionQuery from '../utils/projection-query';

/**
 * @module ember-flexberry-projections
 */

/**
 * {{#crossLink "DS.Store"}}Store{{/crossLink}} mixin to support
 * fetching models using {{#crossLink "Projection"}}projection{{/crossLink}}.
 *
 * @class ProjectedStore
 * @extends Ember.Mixin
 * @public
 */
export default Ember.Mixin.create({
  /**
   * Finds the records for the given model type.
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
  findAll: function(modelName, options) {
    if (options && options.projection) {
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
  findRecord: function(modelName, id, options) {
    if (options && options.projection) {
      // TODO: case of options.reload === false.
      return this.queryRecord(modelName, {
        id: id,
        projection: options.projection
      });
    }

    return this._super.apply(this, arguments);
  },

  /**
   * This method delegates a query to the adapter.
   *
   * See {{#crossLink "DS.Store/query:method"}}{{/crossLink}} for details.
   *
   * @method query
   * @public
   *
   * @param {String} modelName The name of the model type.
   * @param {Object} query An opaque query to be used by the adapter.
   * @param {String} [query.projection] Projection name.
   * @return {Promise} A promise, which is resolved with a
   *                   {{#crossLink "DS.RecordArray"}}RecordArray{{/crossLink}}
   *                   once the server returns.
   */
  query: function(modelName, query) {
    query = this._normalizeQuery(modelName, query);
    return this._super(modelName, query).then(function(recordArray) {
      return recordArray;
    });
  },

  /**
   * This method delegates a query to the adapter.
   *
   * See {{#crossLink "DS.Store/queryRecord:method"}}{{/crossLink}} for details.
   *
   * @method queryRecord
   * @public
   *
   * @param {String} modelName The name of the model type.
   * @param {Object} query An opaque query to be used by the adapter.
   * @param {String} [query.projection] Projection name.
   * @return {Promise} A promise, which is resolved with a
   *                   {{#crossLink "DS.RecordObject"}}RecordObject{{/crossLink}}
   *                   once the server returns.
   */
  queryRecord: function(modelName, query) {
    query = this._normalizeQuery(modelName, query);
    return this._super(modelName, query).then(function(record) {
      return record;
    });
  },

  /**
   * Retrieves projection from query, converts it to query params and
   * merges with query.
   *
   * @method _normalizeQuery
   * @private
   *
   * @param {String} modelName The name of the model type.
   * @param {Object} [query] Query parameters.
   * @param {String} query.projection Projection name.
   * @return {Object} Modified query with projection parameters.
   *                  Returns original query, if projection not specified.
   */
  _normalizeQuery: function(modelName, query) {
    if (query && query.projection) {
      let projName = query.projection;
      let typeClass = this.modelFor(modelName);
      let proj = typeClass.projections.get(projName);
      let projQuery = ProjectionQuery.get(proj, this);

      delete query.projection;
      query = Ember.merge(query, projQuery);
    }

    return query;
  }
});
