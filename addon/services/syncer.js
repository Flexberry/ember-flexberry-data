import Ember from 'ember';
import Builder from '../query/builder';
import { reloadLocalRecords, syncDownRelatedRecords } from '../utils/reload-local-records';
import isModelInstance from '../utils/is-model-instance';

const { RSVP } = Ember;

/**
  @class Syncer
  @namespace Offline
  @extends Ember.Object
*/
export default Ember.Service.extend({
  /**
    Store that use for making requests in offline mode.
    By default it is set to global instane of {{#crossLink "LocalStore"}}{{/crossLink}} class.

    @property offlineStore
    @type <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  */
  offlineStore: undefined,

  /**
  */
  auditEnabled: true,

  /**
   * Initialize offline store.
   *
   * @method init
   * @private
   */
  init: function() {
    let _this = this;

    let localStore = Ember.getOwner(this).lookup('store:local');

    _this.set('offlineStore', localStore);
  },

  /**
   * Save specified records into local store (IndexedDB).
   *
   * @method syncDown
   * @public
   * @param {String|DS.Model|Array} descriptor typeName, record, records.
   * @param {Boolean} [reload] If set to true then syncer perform remote reload for data, otherwise data will get from the store.
   * @param {String} [projectionName] Name of projection for remote reload of data. If not set then all properties of record, except navigation properties, will be read.
   * @param {Object} [params] Additional parameters for syncing down.
   * @param {Query.QueryObject} [params.queryObject] QueryObject instance to make query if descriptor is a typeName.
   * @param {Boolean} [params.unloadSyncedRecords] If set to true then synced records will be unloaded from online store.
   * @return {Promie}
   */
  syncDown: function(descriptor, reload, projectionName, params) {
    let _this = this;

    if (typeof descriptor === 'string') {
      return reloadLocalRecords.call(this, descriptor, reload, projectionName, params);

    } else if (isModelInstance(descriptor)) {
      return _this._syncDownRecord(descriptor, reload, projectionName, params);

    } else if (Ember.isArray(descriptor)) {
      let updatedRecords = descriptor.map(function(record) {
        return _this._syncDownRecord(record, reload, projectionName, params);
      });
      return RSVP.all(updatedRecords);

    } else {
      throw new Error('Input can only be a string, a DS.Model or an array of DS.Model, but is ' + descriptor);
    }
  },

  /**
   * Remove all records in local store.
   *
   * @method
   * @public
   */
  reset: function() {
    return this.get('offlineStore.adapter').clear();
  },

  /**
   * Saves data to local store.
   *
   * @method _syncDownRecord
   * @param {DS.Model} record Record to save in local store.
   * @param {Boolean} [reload] If set to true then syncer perform remote reload for data, otherwise data will get from the store.
   * @param {String} [projectionName] Name of projection for remote reload of data. If not set then all properties of record, except navigation properties, will be read.
   * @param {Object} [params] Additional parameters for syncing down.
   * @param {Query.QueryObject} [params.queryObject] QueryObject instance to make query if descriptor is a typeName.
   * @param {Boolean} [params.unloadSyncedRecords] If set to true then synced records will be unloaded from online store.
   * @private
   */
  _syncDownRecord: function(record, reload, projectionName, params) {
    function saveRecordToLocalStore(store, record, projectionName) {
      let dexieService = Ember.getOwner(this).lookup('service:dexie');
      dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') + 1);
      let modelName = record.constructor.modelName;
      let modelType = store.modelFor(modelName);
      let projection = Ember.isNone(projectionName) ? null : modelType.projections[projectionName];
      let localStore = this.get('offlineStore');
      let localAdapter = localStore.adapterFor(modelName);
      let snapshot = record._createSnapshot();
      let unloadRecordFromStore = () => {
        if (params && params.unloadSyncedRecords) {
          if (store.get('onlineStore')) {
            store.get('onlineStore').unloadRecord(record);
          } else {
            store.unloadRecord(record);
          }
        }
      };

      if (record.get('isDeleted')) {
        return localAdapter.deleteRecord(localStore, snapshot.type, snapshot).then(() => {
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
        }).catch((reason) => {
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
          Ember.Logger.error(reason);
        }).finally(unloadRecordFromStore);
      } else {
        return localAdapter.updateOrCreate(localStore, snapshot.type, snapshot).then(function() {
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
          return projection ? syncDownRelatedRecords(store, record, localAdapter, localStore, projection) : RSVP.resolve();
        }).catch((reason) => {
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
          Ember.Logger.error(reason);
        }).finally(unloadRecordFromStore);
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
        store.get('onlineStore').unloadRecord(modelName)
        return saveRecordToLocalStore.call(_this, store, reloadedRecord, projectionName);
      });
    } else {
      return saveRecordToLocalStore.call(_this, store, record, projectionName);
    }
  },

  /**
  */
  syncUp(continueOnError) {
    let _this = this;
    let store = Ember.getOwner(this).lookup('service:store');
    return _this.get('offlineStore').query('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
      // TODO: Needs sort by `operationTime`.
      // TODO: After inject query language support, add filter `executionResult` by `Unexecuted` or `Failed`.
      executionResult: 'Unexecuted',
    }).then((jobs) => {
      // TODO: Delete `sortBy` after sort by `operationTime`.
      jobs = jobs.sortBy('operationTime');
      return _this._runJobs(store, jobs, continueOnError);
    });
  },

  /**
  */
  createJob(record) {
    let _this = this;
    return new RSVP.Promise((resolve, reject) => {
      _this._createAuditEntity(record).then((auditEntity) => {
        _this._createAuditFields(auditEntity, record).then((auditEntity) => {
          resolve(auditEntity);
        }).catch((reason) => {
          reject(reason);
        });
      });
    });
  },

  /**
  */
  _runJobs(store, jobs, continueOnError, jobCount) {
    let _this = this;
    let job = jobs.shiftObject();
    let executedJob = jobCount || 0;
    return new RSVP.Promise((resolve, reject) => {
      if (job) {
        _this._runJob(store, job).then((job) => {
          _this._endJob(job).then(() => {
            resolve(_this._runJobs(store, jobs, continueOnError, ++executedJob));
          }).catch((reason) => {
            if (continueOnError) {
              resolve(_this._runJobs(store, jobs, continueOnError, executedJob));
            } else {
              reject(reason);
            }
          });
        });
      } else {
        resolve(executedJob);
      }
    });
  },

  /**
  */
  _endJob(job) {
    return new RSVP.Promise((resolve, reject) => {
      if (job.get('executionResult') === 'Выполнено') {
        RSVP.all(job.get('auditFields').map(field => field.destroyRecord())).then(() => {
          resolve(job.destroyRecord());
        });
      } else {
        reject(job);
      }
    });
  },

  /**
  */
  _runJob(store, job) {
    switch (job.get('operationType')) {
      case 'INSERT': return this._runCreatingJob(store, job);
      case 'UPDATE': return this._runUpdatingJob(store, job);
      case 'DELETE': return this._runRemovingJob(store, job);
      default: throw new Error('Unsupported operation type.');
    }
  },

  /**
  */
  _runCreatingJob(store, job) {
    let attributes = {
      id: job.get('objectPrimaryKey'),
    };
    job.get('auditFields').forEach((field) => {
      attributes[field.get('field')] = field.get('newValue');
    });
    return store.createRecord(job.get('objectType.name'), attributes, true).save().then(() => {
      job.set('executionResult', 'Выполнено');
      return job.save();
    }).catch((/*reason*/) => {
      // TODO: Resolve conflicts here.
      job.set('executionResult', 'Ошибка');
      return job.save();
    });
  },

  /**
  */
  _runUpdatingJob(store, job) {
    let query = this._createQuery(store, job);
    return store.queryRecord(query.modelName, query).then((record) => {
      if (record) {
        job.get('auditFields').forEach((field) => {
          record.set(field.get('field'), field.get('newValue'));
        });
        return record.save().then(() => {
          job.set('executionResult', 'Выполнено');
          return job.save();
        }).catch((/*reason*/) => {
          // TODO: Resolve conflicts here.
          job.set('executionResult', 'Ошибка');
          return job.save();
        });
      } else {
        throw new Error('No record is found on server.');
      }
    });
  },

  /**
  */
  _runRemovingJob(store, job) {
    let query = this._createQuery(store, job);
    return store.queryRecord(query.modelName, query).then((record) => {
      if (record) {
        return record.destroyRecord().then(() => {
          job.set('executionResult', 'Выполнено');
          return job.save();
        }).catch((/*reason*/) => {
          // TODO: Resolve conflicts here.
          job.set('executionResult', 'Ошибка');
          return job.save();
        });
      } else {
        throw new Error('No record is found on server.');
      }
    });
  },

  /**
  */
  _createAuditEntity(record) {
    let _this = this;
    return _this._auditDataFromRecord(record).then(
      auditData => _this.get('auditEnabled') ? _this._newAuditEntity(auditData) : _this._updateAuditEntity(auditData)
    );
  },

  /**
  */
  _newAuditEntity(auditData) {
    return this.get('offlineStore').createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', auditData).save();
  },

  /**
  */
  _updateAuditEntity(auditData) {
    let _this = this;
    return _this.get('offlineStore').query('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
      objectPrimaryKey: auditData.objectPrimaryKey,
    }).then((auditEntities) => {
      if (auditEntities.get('length')) {
        let auditEntity = auditEntities.get('firstObject');
        return RSVP.all(auditEntity.get('auditFields').map(field => field.destroyRecord())).then(() => {
          if (auditData.operationType === 'DELETE' && auditEntity.get('operationType') === 'INSERT') {
            return auditEntity.destroyRecord();
          } else {
            delete auditData.operationType;
            auditEntity.setProperties(auditData);
            return auditEntity.save();
          }
        });
      } else {
        return _this._newAuditEntity(auditData);
      }
    });
  },

  /**
  */
  _createAuditFields(auditEntity, record) {
    let promises = [];
    if (auditEntity.get('operationType') !== 'DELETE') {
      let changes = this._changesFromRecord(record);
      for (let change in changes) {
        promises.push(this._createAuditField(auditEntity, change, changes[change]));
      }
    }

    return RSVP.all(promises).then((fields) => {
      auditEntity.set('auditFields', fields);
      return auditEntity.save();
    });
  },

  /**
  */
  _createAuditField(auditEntity, attributeName, attributeData) {
    let _this = this;
    return _this.get('offlineStore').createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', {
      field: attributeName,
      oldValue: attributeData[0],
      newValue: attributeData[1],
      auditEntity: auditEntity,
    }).save();
  },

  /**
  */
  _auditDataFromRecord(record) {
    let _this = this;
    let userService = Ember.getOwner(_this).lookup('service:user');
    let operationType = _this._getOperationType(record.get('dirtyType'));
    return userService.getCurrentUser().then(currentUser => _this._getObjectType(record._createSnapshot().modelName).then(objectType => ({
          objectPrimaryKey: record.get('id'),
          operationTime: new Date(),
          operationType: operationType,
          executionResult: 'Не выполнено',
          createTime: record.get('createTime'),
          creator: record.get('creator'),
          editTime: record.get('editTime'),
          editor: record.get('editor'),
          user: currentUser,
          objectType: objectType,
        })
      )
    );
  },

  /**
  */
  _getObjectType(objectTypeName) {
    let _this = this;
    return _this.get('offlineStore').query('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', {
      name: objectTypeName,
    }).then((objectTypes) => {
      if (objectTypes.get('length')) {
        return new RSVP.resolve(objectTypes.get('firstObject'));
      } else {
        return _this.get('offlineStore').createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', {
          name: objectTypeName,
        }).save();
      }
    });
  },

  /**
  */
  _getOperationType(dirtyType) {
    switch (dirtyType) {
      case 'created': return 'INSERT';
      case 'updated': return 'UPDATE';
      case 'deleted': return 'DELETE';
      default: throw new Error('Unknown dirty type.');
    }
  },

  /**
  */
  _changesFromRecord(record) {
    let changes = {};
    if (this.get('auditEnabled')) {
      let changedAttributes = record.changedAttributes();
      for (let attribute in changedAttributes) {
        changes[attribute] = changedAttributes[attribute];
      }
    } else {
      record.eachAttribute((name) => {
        let value = record.get(name);
        if (value) {
          changes[name] = [null, value];
        }
      });
    }

    return changes;
  },

  /**
  */
  _createQuery(store, job) {
    let builder = new Builder(store)
      .from(job.get('objectType.name'))
      .byId(job.get('objectPrimaryKey'));
    let query = builder.build();
    query.useOnlineStore = true;
    return query;
  },
});
