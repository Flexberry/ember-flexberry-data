import Ember from 'ember';
import isEmbedded from './is-embedded';

var RSVP = Ember.RSVP;

/*
  This method saves specified models by type in offline storage.
  Optionally it allows to reload all specified records from online storage.
  All models will be replaced in local storage.

  @method reloadLocalRecords
  @param {String|DS.Model} type
  @param {Boolean} reload
  @param {String} [projectionName]
  @param {Object} [params] Additional parameters for syncing down.
  @param {Query.QueryObject} [params.queryObject] QueryObject instance to make query if descriptor is a typeName.
  @param {Boolean} [params.unloadSyncedRecords] If set to true then synced records will be unloaded from online store.
  @return {Promise} Promise
  @private
*/
export function reloadLocalRecords(type, reload, projectionName, params) {
  let _this = this;
  var store = Ember.getOwner(this).lookup('service:store');
  var modelType = store.modelFor(type);
  let modelName = modelType.modelName;

  var localStore = Ember.getOwner(this).lookup('store:local');
  var localAdapter = localStore.adapterFor(modelName);

  var reloadedRecords = localAdapter.clear(modelName).then(createAll);

  return reloadedRecords;

  function createAll() {
    var projection = Ember.isNone(projectionName) ? null : modelType.projections[projectionName];
    if (reload) {
      if (params && params.queryObject) {
        params.queryObject = Ember.$.extend(true, params.queryObject, { useOnlineStore: true });
        return store.query(type, params.queryObject).then(function(records) {
          return createLocalRecords.call(_this, store, localAdapter, localStore, modelType, records, projection, params);
        });
      } else {
        let options = {
          reload: true,
          useOnlineStore: true
        };
        options = Ember.isNone(projectionName) ? options : Ember.$.extend(true, options, { projection: projectionName });
        return store.findAll(type, options).then(function(records) {
          return createLocalRecords.call(_this, store, localAdapter, localStore, modelType, records, projection, params);
        });
      }
    } else {
      var records = store.peekAll(type);
      return createLocalRecords.call(_this, store, localAdapter, localStore, modelType, records, projection, params);
    }
  }
}

export function createLocalRecord(store, localAdapter, localStore, modelType, record, projection, params) {
  let _this = this;
  let dexieService = Ember.getOwner(store).lookup('service:dexie');
  let unloadRecordFromStore = () => {
    // TODO: Uncomment this after fix bug with load unloaded models.
    // if (params && params.unloadSyncedRecords) {
    //   if (store.get('onlineStore')) {
    //     store.get('onlineStore').unloadRecord(record);
    //   } else {
    //     store.unloadRecord(record);
    //   }
    // }
  };

  dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') + 1);
  if (record.get('id')) {
    var snapshot = record._createSnapshot();
    let fieldsToUpdate = projection ? projection.attributes : null;
    return new Ember.RSVP.Promise((resolve, reject) => {
      localAdapter.addHashForBulkUpdateOrCreate(localStore, modelType, snapshot, fieldsToUpdate).then(() => {
        let offlineGlobals = Ember.getOwner(_this).lookup('service:offline-globals');
        if (projection || (!projection && offlineGlobals.get('allowSyncDownRelatedRecordsWithoutProjection'))) {
          syncDownRelatedRecords.call(_this, store, record, localAdapter, localStore, projection, params).then(() => {
            resolve(record);
          }, reject);
        } else {
          Ember.Logger.warn('It does not allow to sync down related records without specified projection. ' +
            'Please specify option "allowSyncDownRelatedRecordsWithoutProjection" in environment.js');
          resolve(record);
        }
      }).catch((reason) => {
        Ember.Logger.error(reason);
        reject(reason);
      }).finally(unloadRecordFromStore);
    });
  } else {
    var recordName = record.constructor && record.constructor.modelName;
    var warnMessage = 'Record ' + recordName + ' does not have an id, therefor we can not create it locally: ';

    var recordData = record.toJSON && record.toJSON();

    Ember.Logger.warn(warnMessage, recordData);

    return RSVP.resolve(record);
  }
}

function createLocalRecords(store, localAdapter, localStore, modelType, records, projection, params) {
  let _this = this;
  let recordsCount = records.get('length');
  let accumulatedRecordsCount = 0;
  let createdRecordsPromises = records.map(function(record) {
    return _this._syncDownQueue.attach((resolve, reject) => {
      return createLocalRecord.call(_this, store, localAdapter, localStore, modelType, record, projection, params).then(() => {
        accumulatedRecordsCount++;
        if ((accumulatedRecordsCount % _this.numberOfRecordsForPerformingBulkOperations === 0) || accumulatedRecordsCount === recordsCount) {
          localAdapter.bulkUpdateOrCreate(localStore, true, false).then(() => {
            resolve(record);
          }, reject);
        } else {
          resolve(record);
        }
      }, reject);
    });
  });
  return RSVP.all(createdRecordsPromises);
}

export function syncDownRelatedRecords(store, mainRecord, localAdapter, localStore, projection, params) {
  let _this = this;

  function isAsync(modelType, relationshipName) {
    return Ember.get(modelType, 'relationshipsByName').get(relationshipName).options.async;
  }

  function createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, projection) {
    let modelType = store.modelFor(relatedRecord.constructor.modelName);
    return createLocalRecord.call(_this, store, localAdapter, localStore, modelType, relatedRecord, projection, params);
  }

  function createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, projection) {
    let promises = Ember.A();
    for (let i = 0; i < relatedRecords.get('length'); i++) {
      let relatedRecord = relatedRecords.objectAt(i);
      let modelType = store.modelFor(relatedRecord.constructor.modelName);
      promises.pushObject(createLocalRecord.call(_this, store, localAdapter, localStore, modelType, relatedRecord, projection, params));
    }

    return promises;
  }

  function createRelatedRecords(store, mainRecord, localAdapter, localStore, projection) {
    var promises = Ember.A();
    var modelType = store.modelFor(mainRecord.constructor.modelName);
    var attrs = Ember.isNone(projection) ? null : projection.attributes;
    var relationshipNames = Ember.get(modelType, 'relationshipNames');
    var createRelatedBelongsToRecordFunction = (relatedRecord) => {
      if (!Ember.isNone(relatedRecord)) {
        promises.pushObject(createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[belongToName]));
      }
    };

    for (let i = 0; i < relationshipNames.belongsTo.length; i++) {
      var belongToName = relationshipNames.belongsTo[i];

      // Save related record into local store only if relationship included into projection (if projection is set).
      if (Ember.isNone(projection) || (attrs && attrs.hasOwnProperty(belongToName))) {
        let async = isAsync(modelType, belongToName);
        if (async) {
          mainRecord.get(belongToName).then(createRelatedBelongsToRecordFunction);
        } else {
          if (isEmbedded(store, modelType, belongToName)) {
            var relatedRecord = mainRecord.get(belongToName);
            if (!Ember.isNone(relatedRecord)) {
              promises.pushObject(
                createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[belongToName])
              );
            }
          }
        }
      }
    }

    var createRelatedHasManyRecordsFunction = (relatedRecords) =>
      promises.pushObjects(createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[hasManyName]));

    for (let i = 0; i < relationshipNames.hasMany.length; i++) {
      var hasManyName = relationshipNames.hasMany[i];

      // Save related records into local store only if relationship included into projection (if projection is set).
      if (Ember.isNone(projection) || (attrs && attrs.hasOwnProperty(hasManyName))) {
        let async = isAsync(modelType, hasManyName);
        if (async) {
          mainRecord.get(hasManyName).then(createRelatedHasManyRecordsFunction);
        } else {
          if (isEmbedded(store, modelType, hasManyName)) {
            var relatedRecords = mainRecord.get(hasManyName);
            promises.pushObjects(createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[hasManyName]));
          }
        }
      }
    }

    return RSVP.all(promises);
  }

  return createRelatedRecords(store, mainRecord, localAdapter, localStore, projection);
}
