import { inject as service } from '@ember/service';
import { isNone, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import $ from 'jquery';
import { getOwner } from '@ember/application';
import Store from '@ember-data/store';
import decorateAdapter from './base-store/decorate-adapter';
import decorateAPICall from './base-store/decorate-api-call';
import QueryObject from '../query/query-object';
import isObject from '../utils/is-object';
import OnlineStore from './online-store';
import fixLegacyStore from '../utils/compatible-store-fix';

/**
  Base class for application store.
  service:store should point to instance of that class.

  @class Store
  @extends <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
*/
export default class extends Store {
  /**
    Store offline schemas for all databases.

    @property _offlineSchema
    @type Object
    @private
    @default 'Schema of 1 version for internal models of addon'
  */
  _offlineSchema = {
    'ember-flexberry-data': {
      1: this.offlineGlobals.getOfflineSchema(),
    }
  };

  @service offlineGlobals;

  /**
    Set schema for your database.

    @example
      ```javascript
      // app/services/store.js
      ...
        init() {
          this.set('offlineSchema', {
            <name of database>: {
              <number of version>: {
                <name of model>: <table definition>,
              },
            },
            dbName: {
              1: {
                modelName: 'id,attribute1,attribute2,belongsToRelationship1,belongsToRelationship2,*hasManyRelationship1,*hasManyRelationship2',
                changedModelName: 'id,attribute1,attribute2',
                thisModelWillBeRemovedInNextVersion: 'id,attribute1',
              },
              2: {
                newModelName: 'id,attribute1',
                changedModelName: 'id,attribute1,attribute3,attribute4',
                thisModelWillBeRemovedInNextVersion: null,
              },
            },
          });
          return this._super(...arguments);
        },
      ...
      ```

    @property offlineSchema
    @type Object
  */
    @computed()
    get offlineSchema() {
      return this._offlineSchema;
    }
    set offlineSchema(value) {
      let offlineSchema = this.offlineSchema;
      for (let db in value) {
        if (offlineSchema.hasOwnProperty(db)) {
          for (let version in value[db]) {
            let schema = offlineSchema[db][version] || {};
            offlineSchema[db][version] = Object.assign(schema, value[db][version]);
          }
        } else {
          offlineSchema[db] = value[db];
        }
      }

      return this._offlineSchema = offlineSchema;
    }

  /**
    Add model names that be loaded from offline store.

    @example
      ```javascript
      // app/services/store.js
      ...
        offlineModels: {
          myModel: true,
        },
      ...
      ```

    @property offlineModels
    @type Object
    @default {}
  */
  offlineModels = {};

  /**
    Global instance of {{#crossLink "Syncer"}}{{/crossLink}} class that contains methods to sync model.

    @property syncer
    @type Syncer
    @readOnly
  */
  @service syncer;

  /**
    Instance of dexie service.

    @property dexieService
    @type Offline.DexieService
  */
  @service('dexie') dexieService;

  /*
    Store initialization.
  */
  constructor() {
    super(...arguments);
    let owner = getOwner(this);

    // Set online store if it is not specified in application explicitly.
    if (isNone(this.onlineStore)) {
      let onlineStore = OnlineStore.create(owner.ownerInjection());
      this.onlineStore = onlineStore;
    }

    // Set offline store.
    let offlineStore = owner.lookup('store:local');
    this.offlineStore = offlineStore;
    this.offlineStore.offlineSchema = this.offlineSchema;

    fixLegacyStore(this);
  }

  /**
    This method returns a fresh collection from the server, regardless of if there is already records
    in the store or not.
    @method findAll
    @param {String} modelName
    @param {Object} options
    @param {Boolean} [options.useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Promise} promise
  */
  findAll(modelName, options) {
    if (this.offlineGlobals.isOfflineEnabled) {
      let offlineStore = this.offlineStore;
      let useOnlineStoreParam = !isEmpty(options) && !isEmpty(options.useOnlineStore) ? options.useOnlineStore : null;
      let useOnlineStoreCondition = this._useOnlineStore(modelName, useOnlineStoreParam);
      return useOnlineStoreCondition ? this._decorateMethodAndCall('all', 'findAll', arguments, 1) : offlineStore.findAll.apply(offlineStore, arguments);
    } else {
      let onlineStore = this.onlineStore;
      return onlineStore.findAll.apply(onlineStore, arguments);
    }
  }

  /**
   * This method returns a record for a given type and id combination.
   * NOTE: this will trigger syncUp twice, this is OK. And since this is
   *  a public method, we probably want to preserve this.
    @method findRecord
    @param {String} modelName
    @param {String|Integer} id
    @param {Object} options
    @param {Boolean} [options.useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Promise} promise
   */
  findRecord(modelName, id, options) {
    if (this.offlineGlobals.isOfflineEnabled) {
      let offlineStore = this.offlineStore;
      let useOnlineStoreParam = !isEmpty(options) && !isEmpty(options.useOnlineStore) ? options.useOnlineStore : null;
      let useOnlineStoreCondition = this._useOnlineStore(modelName, useOnlineStoreParam);
      return useOnlineStoreCondition ?
        this._decorateMethodAndCall('single', 'findRecord', arguments, 2) :
        offlineStore.findRecord.apply(offlineStore, arguments);
    } else {
      let onlineStore = this.onlineStore;
      return onlineStore.findRecord.apply(onlineStore, arguments);
    }
  }

  /**
    Query for records that meet certain criteria. Resolves with [DS.RecordArray](http://emberjs.com/api/data/classes/DS.RecordArray.html).
	For more information see [query method](http://emberjs.com/api/data/classes/DS.Store.html#method_query) of [DS.Store](http://emberjs.com/api/data/classes/DS.Store.html).
    @method query
    @param {String} modelName
    @param {Object} query
    @param {Boolean} [query.useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Promise} promise
  */
  query(modelName, query) {
    // TODO: Method `copy` bewitch `QueryObject` into `Object`.
    let _query = query instanceof QueryObject ? query : Object.assign({}, query);

    if (this.offlineGlobals.isOfflineEnabled) {
      let offlineStore = this.offlineStore;
      let useOnlineStoreParam = !isEmpty(_query) && !isEmpty(_query.useOnlineStore) ? _query.useOnlineStore : null;
      if (!isEmpty(_query) && !isEmpty(_query.useOnlineStore)) {
        delete _query.useOnlineStore;
      }

      let useOnlineStoreCondition = this._useOnlineStore(modelName, useOnlineStoreParam);
      return useOnlineStoreCondition ?
        this._decorateMethodAndCall('multiple', 'query', [modelName, _query], -1) :
        offlineStore.query.apply(offlineStore, [modelName, _query]);
    } else {
      let onlineStore = this.onlineStore;
      return onlineStore.query.apply(onlineStore, [modelName, _query]);
    }
  }

  /**
    Query for record that meet certain criteria. Resolves with single record.
    @method query
    @param {String} modelName
    @param {Object} query
    @param {Boolean} [query.useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Promise} promise
  */
  queryRecord(modelName, query) {
    // TODO: Method `copy` bewitch `QueryObject` into `Object`.
    let _query = query instanceof QueryObject ? query : Object.assign({}, query);

    if (this.offlineGlobals.isOfflineEnabled) {
      let offlineStore = this.offlineStore;
      let useOnlineStoreParam = !isEmpty(_query) && !isEmpty(_query.useOnlineStore) ? _query.useOnlineStore : null;
      if (!isEmpty(_query) && !isEmpty(_query.useOnlineStore)) {
        delete _query.useOnlineStore;
      }

      let useOnlineStoreCondition = this._useOnlineStore(modelName, useOnlineStoreParam);
      return useOnlineStoreCondition ?
        this._decorateMethodAndCall('single', 'queryRecord', [modelName, _query], -1) :
        offlineStore.queryRecord.apply(offlineStore, [modelName, _query]);
    } else {
      let onlineStore = this.onlineStore;
      return onlineStore.queryRecord.apply(onlineStore, [modelName, _query]);
    }
  }

  /**
    Create a new record in the current store. The properties passed to this method are set on the newly created record.
    @method createRecord
    @param {String} modelName
    @param {Object} inputProperties A hash of properties to set on the newly created record.
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Promise} promise
  */
  createRecord() {
    return this._callSuperMethod('createRecord', 2, arguments);
  }

  /**
    For symmetry, a record can be deleted via the store.
    @method deleteRecord
    @param {DS.Model} record
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
  */
  deleteRecord() {
    return this._callSuperMethod('deleteRecord', 1, arguments);
  }

  /**
    Delete all record from the current store.
    @method deleteRecord
    @param {DS.Model} record
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
  */
  deleteAllRecords() {
    return this._callSuperMethod('deleteAllRecords', 2, arguments);
  }

  /**
    Get the reference for the specified record.
    @method getReference
    @param {String} type
    @param {String|Integer} id
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {RecordReference} promise
  */
  getReference() {
    return this._callSuperMethod('getReference', 2, arguments);
  }

  /**
    Returns true if a record for a given type and ID is already loaded.
    @method hasRecordForId
    @param {String|DS.Model} modelName
    @param {String|Integer} inputId
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Boolean}
  */
  hasRecordForId() {
    return this._callSuperMethod('hasRecordForId', 2, arguments);
  }

  /**
    Converts a json payload into the normalized form that {{#crossLink "BaseStore/push:method"}}{{/crossLink}} expects.
    @method normalize
    @param {String} modelName The name of the model type for this payload
    @param {Object} payload
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Object} The normalized payload
  */
  normalize() {
    return this._callSuperMethod('normalize', 2, arguments);
  }

  /**
    This method returns a filtered array that contains all of the known records for a given type in the store.
    @method peekAll
    @param {String} modelName
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {DS.RecordArray}
  */
  peekAll() {
    return this._callSuperMethod('peekAll', 1, arguments);
  }

  /**
    Get a record by a given type and ID without triggering a fetch.
    @method peekRecord
    @param {String} modelName
    @param {String|Integer} id
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {DS.Model|null} Record
  */
  peekRecord() {
    return this._callSuperMethod('peekRecord', 2, arguments);
  }

  /**
    Push some data for a given type into the store.
    @method push
    @param {Object} data
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {DS.Model|Array} The record(s) that was created or updated.
  */
  push() {
    return this._callSuperMethod('push', 1, arguments);
  }

  /**
    Push some raw data into the store.
    @method pushPayload
    @param {String} modelName
    @param {Object} inputPayload
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
  */
  pushPayload() {
    return this._callSuperMethod('pushPayload', 2, arguments);
  }

  /**
    This method returns if a certain record is already loaded in the store.
    @method recordIsLoaded
    @param {String} modelName
    @param {String|Integer} id
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {Boolean}
  */
  recordIsLoaded() {
    return this._callSuperMethod('recordIsLoaded', 2, arguments);
  }

  /**
    This method unloads all records in the store.
    @method unloadAll
    @param {String} modelName
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
  */
  unloadAll() {
    if (!this.isDestroying) {
      return this._callSuperMethod('unloadAll', 1, arguments);
    }
  }

  /**
    For symmetry, a record can be unloaded via the store. Only non-dirty records can be unloaded.
    @method unloadRecord
    @param {DS.Model} record
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
  */
  unloadRecord() {
    return this._callSuperMethod('unloadRecord', 1, arguments);
  }

  /**
   * Pushes into store the model that exists in backend without a request to it.
   * @method createExistingRecord
   * @param {String} modelName Name of the model to push into store.
   * @param {String} primaryKey Primery key of the model to push into store.
   * @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
   */
  createExistingRecord() {
    return this._callSuperMethod('createExistingRecord', 2, arguments);
  }

  /**
    A method to send batch update, create or delete models in single transaction.

    All models saving using this method must have identifiers.

    The array which fulfilled the promise may contain the following values:
    - `same model object` - for created, updated or unaltered records.
    - `null` - for deleted records.

    @method batchUpdate
    @param {DS.Model[]|DS.Model} models Is array of models or single model for batch update.
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status.
    @return {Promise} A promise that fulfilled with an array of models in the new state.
  */
  batchUpdate() {
    return this._callSuperMethod('batchUpdate', 2, arguments);
  }

  /**
    A method to get array of models with batch request.

    @method batchSelect
    @param {Query} queries Array of Flexberry Query objects.
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status.
    @return {Promise} A promise that fulfilled with an array of query responses.
  */
  batchSelect() {
    return this._callSuperMethod('batchSelect', 2, arguments);
  }

  /**
    Returns an instance of the adapter for a given type.
    @method adapterFor
    @param {String} modelName
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {DS.Adapter or subclass} Adapter
  */
  adapterFor(modelName, useOnlineStore) {
    let onlineStore = this.onlineStore;
    let offlineStore = this.offlineStore;
    let adapter = onlineStore.adapterFor(modelName);
    if (this.offlineGlobals.isOfflineEnabled) {
      let useOnlineStoreCondition = this._useOnlineStore(modelName, !isNone(useOnlineStore) ? useOnlineStore : null);
      return useOnlineStoreCondition ? decorateAdapter.call(this, adapter, modelName) : offlineStore.adapterFor.call(offlineStore, modelName);
    } else {
      return adapter;
    }
  }

  /**
    Returns an instance of the serializer for a given type.
    @method serializerFor
    @param {String} modelName
    @param {Boolean} [useOnlineStore] Allow to explicitly specify online or offline store using independently of global online status
    @return {DS.Serializer or subclass} Serializer
  */
  serializerFor(modelName, useOnlineStore) {
    let onlineStore = this.onlineStore;
    let offlineStore = this.offlineStore;
    let serializer = onlineStore.serializerFor(modelName);
    if (this.offlineGlobals.isOfflineEnabled) {
      let useOnlineStoreCondition = this._useOnlineStore(modelName, !isNone(useOnlineStore) ? useOnlineStore : null);
      return useOnlineStoreCondition ? onlineStore.serializerFor.call(onlineStore, modelName) : offlineStore.serializerFor.call(offlineStore, modelName);
    } else {
      return serializer;
    }
  }

  /*
    Decorate specified method of online store for add extra syncing features.
  */
  _decorateMethodAndCall(finderType, originMethodName, originMethodArguments, optionsIndex) {
    let onlineStore = this.onlineStore;
    let originMethod = onlineStore[originMethodName];
    let decoratedMethod = decorateAPICall(finderType, originMethod);
    if (optionsIndex > -1) {
      let options = originMethodArguments[optionsIndex];
      options = this.offlineGlobals.isOfflineEnabled ? options : $.extend(true, { bypass: true }, options);
      originMethodArguments[optionsIndex] = options;
    }

    return decoratedMethod.apply(onlineStore, originMethodArguments);
  }

  /*
    Detect global online status.
  */
  _isOnline() {
    return this.offlineGlobals.isOnline;
  }

  /*
    Pass control flow to online or offline store depend on global online status
    and explicitly specified store to use.
  */
  _callSuperMethod(methodName, useOnlineStoreParamNum, ...args) {
    let onlineStore = this.onlineStore;
    let offlineStore = this.offlineStore;
    let modelName = this._getModelName(methodName, args[0]);
    let useOnlineStoreParam = (args[0].length - 1) >= useOnlineStoreParamNum ? args[0][useOnlineStoreParamNum] : null;
    let useOnlineStoreCondition = this._useOnlineStore(modelName, useOnlineStoreParam);
    let offlineEnabled = this.offlineGlobals.isOfflineEnabled;
    return !offlineEnabled || (offlineEnabled && useOnlineStoreCondition) ?
      onlineStore[methodName].apply(onlineStore, args[0]) :
      offlineStore[methodName].apply(offlineStore, args[0]);
  }

  /**
    Detect model name by method name and arguments.

    @method _getModelName
    @private
    @param {String} methodName
    @param {Array} methodArguments
    @return {String}
  */
  _getModelName(methodName, methodArguments) {
    let methodsWithExplicitlySpecifiedModelName = ['createRecord', 'getReference', 'hasRecordForId', 'normalize', 'peekAll', 'peekRecord', 'recordIsLoaded'];
    let methodsWithImplicitlySpecifiedModelName = ['deleteRecord', 'unloadRecord'];
    if (methodsWithExplicitlySpecifiedModelName.indexOf(methodName) > -1) {
      return methodArguments[0];
    } else if (methodsWithImplicitlySpecifiedModelName.indexOf(methodName) > -1) {
      return methodArguments[0].constructor.modelName;
    } else if (methodName === 'push') {
      let hash = methodArguments[0].data;
      if (isObject(hash)) {
        return hash.type;
      } else if ($.isArray(hash)) {
        return hash.length > 0 ? hash[0].type : '';
      } else if (isObject(methodArguments[0]) && methodArguments[0].hasOwnProperty('type')) {
        return methodArguments[0].type;
      } else {
        return '';
      }
    } else if (methodName === 'pushPayload' || methodName === 'unloadAll') {
      if (!isNone(methodArguments[0]) && typeof methodArguments[0] === 'string') {
        return methodArguments[0];
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /*
    Detect which store should be used for specified modelName.
  */
  _useOnlineStore(modelName, useOnlineStoreParam) {
    let isOfflineModel = !isEmpty(modelName) ? this.offlineModels[modelName] : undefined;
    let useOnlineStore = useOnlineStoreParam === null ? typeof isOfflineModel === 'boolean' ? !isOfflineModel : null : useOnlineStoreParam;
    return useOnlineStore || (useOnlineStore === null && this._isOnline());
  }

  /**
    Update all databases in accordance with actual schemas.

    @method _dbInit
    @private
  */
  _dbInit() {
    let offlineSchema = this.offlineSchema;
    let dexieService = this.dexieService;
    for (let dbName in offlineSchema) {
      dexieService.dexie(dbName, this.offlineStore);
    }
  }
};
