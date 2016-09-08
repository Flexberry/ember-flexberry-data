import Ember from 'ember';
import DS from 'ember-data';
import OfflineAdapter from '../adapters/offline';
import QueryBuilder from '../query/builder';

/**
  @module ember-flexberry-data
*/

/**
  Store that used in offline mode by default.
  @class LocalStore
  @namespace Offline
  @extends <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  @private
*/
export default DS.Store.extend({
  /**
    Database name for IndexedDB.

    @property databaseName
    @type String
  */
  databaseName: undefined,

  init: function() {
    let owner = Ember.getOwner(this);
    let databaseName = Ember.isNone(this.get('databaseName')) ? 'ember-flexberry-data' : this.get('databaseName');
    let adapter = OfflineAdapter.create(owner.ownerInjection(), {
      databaseName: databaseName,
    });

    this.set('adapter', adapter);

    this._super(...arguments);
  },

  /**
   * Returns an instance of the serializer for a given type.
   * Offline serializers should have name with postfix '-offline'.
   *
   * @method serializerFor
   * @param {String} modelName The name of the model type.
   * @public
   */
  serializerFor: function(modelName) {
    let owner = Ember.getOwner(this);
    let serializer = owner.lookup(`serializer:${modelName}-offline`);
    if (!serializer) {
      serializer = owner.lookup(`serializer:application-offline`);
      if (!serializer) {
        serializer = this.adapterFor(modelName).defaultSerializer;
      }
    }

    return serializer;
  },

  /**
   * Returns an instance of the adapter for a given type.
   * Offline adapters should have name with postfix '-offline'.
   *
   * @method adapterFor
   * @param {String} modelName The name of the model type.
   * @public
   */
  adapterFor: function(modelName) {
    let owner = Ember.getOwner(this);
    let adapter = owner.lookup(`adapter:${modelName}-offline`);
    if (!adapter) {
      adapter = owner.lookup(`adapter:application-offline`);
      if (!adapter) {
        adapter = this.get('adapter');
      }
    }

    return adapter;
  },

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
    let builder = new QueryBuilder(this, modelName);
    let queryObject = builder.build();
    if (options && options.projection) {
      queryObject.projection = options.projection;
      return this.query(modelName, queryObject);
    }

    return this._super(...arguments);
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
    // TODO: case of options.reload === false.
    let builder = new QueryBuilder(this, modelName).byId(id);
    let queryObject = builder.build();
    if (options && options.projection) {
      queryObject.projection = options.projection;
    }

    return this.queryRecord(modelName, queryObject);
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
    return this._super(modelName, query);
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
    return this._super(modelName, query);
  },

  /**
   * Changes `databaseName` adapter's property if `databaseName` property was changed.
   */
  _databaseNameObserver: Ember.observer('databaseName', function() {
    let databaseName = this.get('databaseName');
    this.get('adapter').set('databaseName', databaseName);
  })
});
