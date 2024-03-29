import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import { debug } from '@ember/debug';
import { isArray } from '@ember/array';

import QueryBuilder from '../query/builder';

/**
 * Mixin for {{#crossLink "DS.Store"}}Store{{/crossLink}} to support
 * fetching models using projection.
 *
 * @module ember-flexberry-data
 * @class StoreMixin
 * @extends Ember.Mixin
 */
export default Mixin.create({
  /**
   *
   * @method query
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  query(modelName, query) {
    debug(`Flexberry Store::query ${modelName}`, query);

    let promise = this._super(...arguments);
    return new RSVP.Promise((resolve, reject) => {
      promise.then((results) => {
        if (results && isArray(results)) {
          results.forEach((result) => {
            result.didLoad();
          });
        }

        resolve(results);
      }, reject);
    });
  },

  /**
   *
   * @method queryRecord
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  queryRecord(modelName, query) {
    debug(`Flexberry Store::queryRecord ${modelName}`, query);

    return this.query(modelName, query).then(result => new RSVP.Promise((resolve) => resolve(result.get('firstObject'))));
  },

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
    debug(`Flexberry Store::findAll ${modelName}`);

    let builder = new QueryBuilder(this, modelName);

    if (options && options.projection) {
      debug(`Flexberry Store::findAll using projection '${options.projection}'`);

      builder.selectByProjection(options.projection);
      return this.query(modelName, builder.build());
    }

    let queryObject = builder.build();

    // Now if projection is not specified then only 'id' field will be selected.
    queryObject.select = [];
    return this.query(modelName, queryObject);
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
    debug(`Flexberry Store::findRecord ${modelName}(${id})`);

    let builder = new QueryBuilder(this, modelName).byId(id);

    if (options && options.projection) {
      debug(`Flexberry Store::findRecord using projection '${options.projection}'`);

      builder.selectByProjection(options.projection);
      return this.query(modelName, builder.build()).then(result => new RSVP.Promise((resolve) => resolve(result.get('firstObject'))));
    }

    let queryObject = builder.build();

    // Now if projection is not specified then only 'id' field will be selected.
    queryObject.select = [];
    return this.query(modelName, queryObject).then(result => new RSVP.Promise((resolve) => resolve(result.get('firstObject'))));
  }
});
