/**
  @module ember-flexberry-data
*/

import { assert, debug } from '@ember/debug';
import { isNone, isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { cleanup } from '@ember-data/legacy-compat';
import Store from '@ember-data/store';
import RSVP from 'rsvp';
import { isArray } from '@ember/array';
import QueryBuilder from '../query/builder';
import fixLegacyStore from '../utils/compatible-store-fix';

/**
  Store that used in online mode by default.

  @class OnlineStore
  @namespace OData
  @extends <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  @private
*/
export default class extends Store {
  constructor() {
    super(...arguments);

    fixLegacyStore(this);
  }

  /**
   *
   * @method query
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  query(modelName, query) {
    debug(`Flexberry Store::query ${modelName}`, query);

    let promise = super.query(...arguments);
    return new RSVP.Promise((resolve, reject) => {
      promise.then((results) => {
        if (results && isArray(results)) {
          results.forEach((result) => {
            result.didLoad();
          });
        }

        resolve(results/*.toArray()*/);
      }, reject);
    });
  }

  /**
   *
   * @method queryRecord
   * @param {String} modelName
   * @param {any} query an opaque query to be used by the adapter
   * @return {Promise} promise
   */
  queryRecord(modelName, query) {
    debug(`Flexberry Store::queryRecord ${modelName}`, query);

    return this.query(modelName, query).then(result => new RSVP.Promise((resolve) => resolve(result[0])));
  }

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
  }

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
      return this.query(modelName, builder.build()).then(result => new RSVP.Promise((resolve) => resolve(result[0])));
    }

    let queryObject = builder.build();

    // Now if projection is not specified then only 'id' field will be selected.
    queryObject.select = [];
    return this.query(modelName, queryObject).then(result => new RSVP.Promise((resolve) => resolve(result[0])));
  }

  /**
    Delete all record from the current store.
    @method deleteRecord
    @param {String} modelName modelName
    @param {Object} filter filter
  */
  deleteAllRecords(modelName, filter) {
    let adapter = this.adapterFor(modelName);
    if (isNone(adapter.deleteAllRecords)) {
      assert('Method \'deleteAllRecords\' is missing');
    }

    return adapter.deleteAllRecords(adapter.store, modelName, filter);
  }

  /**
    A method to send batch update, create or delete models in single transaction.

    All models saving using this method must have identifiers.

    The array which fulfilled the promise may contain the following values:
    - `same model object` - for created, updated or unaltered records.
    - `null` - for deleted records.

    @method batchUpdate
    @param {DS.Model[]|DS.Model} models Is array of models or single model for batch update.
    @param {Object} getProjections Optional projections for updated models.
    @return {Promise} A promise that fulfilled with an array of models in the new state.
  */
  batchUpdate(models, getProjections) {
    return this.adapterFor('application').batchUpdate(this, models, getProjections);
  }

  /**
    A method to get array of models.

    @method batchSelect
    @param {Array} queries Array of Flexberry Query objects.
    @return {Promise} A promise that fulfilled with an array of query responses.
  */
  batchSelect(queries) {
    return this.adapterFor('application').batchSelect(this, queries).then(result => {
      const batchResult = A();
      result.forEach((records) => {
        const array = A();
        array.addObjects(this.push(records));
        array.meta = records.meta;
        batchResult.addObject(array);
      });

      return batchResult;
    });
  }

  /**
   * Pushes into store the model that exists in backend without a request to it.
   * @param {String} modelName Name of the model to push into store.
   * @param {String} primaryKey Primery key of the model to push into store.
   */
  createExistingRecord(modelName, primaryKey) {
    assert('Model name for store.createExistingRecord() method must not be blank.', !isBlank(modelName));
    assert('Model primary key for store.createExistingRecord() method must not be blank.', !isBlank(primaryKey));

    return this.push({
      data: {
        id: primaryKey,
        type: modelName
      }
    });
  }

  destroy() {
    cleanup.call(this);
    super.destroy();
  }
};
