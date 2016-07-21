import Ember from 'ember';
import {reloadLocalRecords, syncDownRelatedRecords} from './utils/reload-local-records';
import isModelInstance from './utils/is-model-instance';

var RSVP = Ember.RSVP;

/**
  We save offline jobs to localforage and run them one at a time when online

  Job schema:
  ```
  {
    id:        { String },
    operation: { 'createRecord'|'updateRecord'|'deleteRecord' },
    typeName:  { String },
    record:    { Object },
    createdAt: { Date },
  }
  ```

  We save remoteIdRecords to localforage. They are used to lookup remoteIds
  from localIds.

  RecordId schema:
  ```
  {
    typeName: { String },
    localId:  { String },
    remoteId: { String }
  }
  ```

  @class Syncer
  @namespace Offline
  @extends Ember.Object
*/
export default Ember.Object.extend({
  db: null,

  // initialize jobs since jobs may be used before we fetch from localforage
  jobs: [],
  remoteIdRecords: [],

  /**
    Store that use for making requests in offline mode.
    By default it is set to global instane of {{#crossLink "LocalStore"}}{{/crossLink}} class.

    @property offlineStore
    @type <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  */
  offlineStore: undefined,

  /**
   * Initialize db.
   *
   * Initialize jobs, remoteIdRecords.
   *
   * @method init
   * @private
   */
  init: function() {
    let _this = this;

    let localStore = Ember.getOwner(this).lookup('store:local');

    _this.set('db', window.localforage);
    _this.set('offlineStore', localStore);

    // NOTE: get remoteIdRecords first then get jobs,
    // since jobs depend on remoteIdRecords
    /*
    _this.getAll('remoteIdRecord').then(
      _this.getAll.bind(_this, 'job')
    );
    */
  },

  /**
   * TODO:
   * Save all records in the store into localforage.
   *
   * @method syncDown
   * @public
   * @param {String|DS.Model|Array} descriptor typeName, record, records.
   * @param {Boolean} [reload] If set to true then syncer perform remote reload for data, otherwise data will get from the store.
   * @param {String} [projectionName] Name of projection for remote reload of data. If not set then all properties of record, except navigation properties, will be read.
   * @return {Promie}
   */
  syncDown: function(descriptor, reload, projectionName) {
    let _this = this;

    if (typeof descriptor === 'string') {
      return reloadLocalRecords.call(this, descriptor, reload, projectionName);

    } else if (isModelInstance(descriptor)) {
      return _this._syncDownRecord(descriptor, reload, projectionName);

    } else if (Ember.isArray(descriptor)) {
      let updatedRecords = descriptor.map(function(record) {
        return _this._syncDownRecord(record, reload, projectionName);
      });
      return RSVP.all(updatedRecords);

    } else {
      throw new Error('Input can only be a string, a DS.Model or an array of DS.Model, but is ' + descriptor);
    }
  },

  /**
   * Reset syncer and localforage records.
   * Remove all jobs and remoteIdRecords.
   * Remove all records in localforage.
   *
   * @method
   * @public
   */
  reset: function() {
    return RSVP.all([
      this.deleteAll('job'),
      this.deleteAll('remoteIdRecord'),
      this.this.get('offlineStore.adapter').clear()
    ]);
  },

  /**
   * Saves data to local store.
   *
   * @method _syncDownRecord
   * @param {DS.Model} record Record to save in local store.
   * @param {Boolean} [reload] If set to true then syncer perform remote reload for data, otherwise data will get from the store.
   * @param {String} [projectionName] Name of projection for remote reload of data. If not set then all properties of record, except navigation properties, will be read.
   * @private
   */
  _syncDownRecord: function(record, reload, projectionName) {
    function saveRecordToLocalStore(store, record, projectionName) {
      let modelName = record.constructor.modelName;
      let modelType = store.modelFor(modelName);
      let projection = modelType.projections[projectionName];
      let localStore = this.get('offlineStore');
      let localAdapter = localStore.adapterFor(modelName);
      let snapshot = record._createSnapshot();

      if (record.get('isDeleted')) {
        return localAdapter.deleteRecord(localStore, snapshot.type, snapshot);
      } else {
        return localAdapter.createRecord(localStore, snapshot.type, snapshot).then(function() {
          return syncDownRelatedRecords(store, record, localAdapter, localStore, projection);
        });
      }
    }

    var _this = this;
    var store = Ember.getOwner(this).lookup('service:store');
    if (reload) {
      let modelName = record.constructor.modelName;
      let options = {
        reload: true,
        useOnlineStore: true
      };
      options = Ember.isNone(projectionName) ? options : Ember.$.extend(true, options, { projection: projectionName });
      return store.findRecord(modelName, record.id, options).then(function(reloadedRecord) {
        return saveRecordToLocalStore.call(_this, store, reloadedRecord, projectionName);
      });
    } else {
      return saveRecordToLocalStore.call(_this, store, record, projectionName);
    }
  },

  deleteAll: function(typeName) {
    return this.saveAll(typeName, []);
  },

  saveAll: function(typeName, records) {
    this.set(pluralize(typeName), records);

    var namespace = getNamespace(typeName);
    return this.get('db').setItem(namespace, records);
  }
});

function pluralize(typeName) {
  return typeName + 's';
}

function getNamespace(typeName) {
  var LocalForageKeyHash = {
    job: 'EmberFryctoriaJobs',
    remoteIdRecord: 'EmberFryctoriaRemoteIdRecords',
  };
  return LocalForageKeyHash[typeName];
}
