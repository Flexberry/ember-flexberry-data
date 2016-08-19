import Ember from 'ember';
import Builder from './query/builder';
import { reloadLocalRecords, syncDownRelatedRecords } from './utils/reload-local-records';
import isModelInstance from './utils/is-model-instance';

const { RSVP } = Ember;

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
  */
  auditEnabled: true,

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
      let projection = Ember.isNone(projectionName) ? null : modelType.projections[projectionName];
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
  },

  /**
  */
  syncUp(continueOnError) {
    let _this = this;
    let store = Ember.getOwner(this).lookup('service:store');
    return _this.get('offlineStore').query('iCSSoftSTORMNETBusinessAuditObjectsAuditEntity', {
      // TODO: Needs sort by `operationTime`.
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
      if (job.get('executionResult') === 'Executed') {
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
      case 'created': return this._runCreatingJob(store, job);
      case 'updated': return this._runUpdatingJob(store, job);
      case 'deleted': return this._runRemovingJob(store, job);
      default: throw new Error('Unknown operation type.');
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
    return store.createRecord(job.get('objectType'), attributes, true).save().then(() => {
      job.set('executionResult', 'Executed');
      return job.save();
    }).catch((/*reason*/) => {
      // TODO: Resolve conflicts here.
      job.set('executionResult', 'Failed');
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
          job.set('executionResult', 'Executed');
          return job.save();
        }).catch((/*reason*/) => {
          // TODO: Resolve conflicts here.
          job.set('executionResult', 'Failed');
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
          job.set('executionResult', 'Executed');
          return job.save();
        }).catch((/*reason*/) => {
          // TODO: Resolve conflicts here.
          job.set('executionResult', 'Failed');
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
    let auditData = this._auditDataFromRecord(record);
    return this.get('auditEnabled') ? this._newAuditEntity(auditData) : this._updateAuditEntity(auditData);
  },

  /**
  */
  _newAuditEntity(auditData) {
    return this.get('offlineStore').createRecord('iCSSoftSTORMNETBusinessAuditObjectsAuditEntity', auditData).save();
  },

  /**
  */
  _updateAuditEntity(auditData) {
    let _this = this;
    return _this.get('offlineStore').queryRecord('iCSSoftSTORMNETBusinessAuditObjectsAuditEntity', {
      objectPrimaryKey: auditData.objectPrimaryKey,
    }).then((auditEntity) => {
      if (auditEntity) {
        return RSVP.all(auditEntity.get('auditFields').map(field => field.destroyRecord())).then(() => {
          if (auditData.operationType === 'deleted' && auditEntity.get('operationType') === 'created') {
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
    if (auditEntity.get('operationType') !== 'deleted') {
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
    return _this.get('offlineStore').createRecord('iCSSoftSTORMNTTBusinessAuditObjectsAuditField', {
      field: attributeName,
      oldValue: attributeData[0],
      newValue: attributeData[1],
      auditEntity: auditEntity,
    }).save();
  },

  /**
  */
  _auditDataFromRecord(record) {
    return {
      objectPrimaryKey: record.get('id'),
      operationTime: new Date(),
      operationType: record.get('dirtyType'),
      createTime: record.get('createTime'),
      creator: record.get('creator'),
      editTime: record.get('editTime'),
      editor: record.get('editor'),
      objectType: record._createSnapshot().modelName,
    };
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
      .from(job.get('objectType'))
      .byId(job.get('objectPrimaryKey'));
    let query = builder.build();
    query.useOnlineStore = true;
    return query;
  },
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
