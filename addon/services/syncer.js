import Ember from 'ember';
import Builder from '../query/builder';
import { SimplePredicate } from '../query/predicate';
import { reloadLocalRecords, syncDownRelatedRecords } from '../utils/reload-local-records';
import isModelInstance from '../utils/is-model-instance';

const { RSVP, isNone, isArray, getOwner, get } = Ember;

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

    let localStore = getOwner(this).lookup('store:local');

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

    } else if (isArray(descriptor)) {
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
  _syncDownRecord: function(record, reload, projectionName/*, params*/) {
    var _this = this;

    function saveRecordToLocalStore(store, record, projectionName) {
      let dexieService = getOwner(_this).lookup('service:dexie');
      dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') + 1);
      let modelName = record.constructor.modelName;
      let modelType = store.modelFor(modelName);
      let projection = isNone(projectionName) ? null : modelType.projections[projectionName];
      let localStore = this.get('offlineStore');
      let localAdapter = localStore.adapterFor(modelName);
      let snapshot = record._createSnapshot();
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
          let offlineGlobals = Ember.getOwner(_this).lookup('service:offline-globals');
          if (projection || (!projection && offlineGlobals.get('allowSyncDownRelatedRecordsWithoutProjection'))) {
            return syncDownRelatedRecords.call(_this, store, record, localAdapter, localStore, projection);
          } else {
            Ember.Logger.warn('It does not allow to sync down related records without specified projection. ' +
              'Please specify option "allowSyncDownRelatedRecordsWithoutProjection" in environment.js');
            return RSVP.resolve();
          }
        }).catch((reason) => {
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
          Ember.Logger.error(reason);
        }).finally(unloadRecordFromStore);
      }
    }

    var store = getOwner(this).lookup('service:store');
    if (reload) {
      let modelName = record.constructor.modelName;
      let options = {
        reload: true,
        useOnlineStore: true
      };
      options = isNone(projectionName) ? options : Ember.$.extend(true, options, { projection: projectionName });
      return store.findRecord(modelName, record.id, options).then(function(reloadedRecord) {

        // TODO: Uncomment this after fix bug with load unloaded models.
        // store.get('onlineStore').unloadRecord(modelName);
        return saveRecordToLocalStore.call(_this, store, reloadedRecord, projectionName);
      });
    } else {
      return saveRecordToLocalStore.call(_this, store, record, projectionName);
    }
  },

  /**
  */
  syncUp(continueOnError) {
    let dexieService = getOwner(this).lookup('service:dexie');
    let store = getOwner(this).lookup('service:store');
    let modelName = 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity';
    let predicate = new SimplePredicate('executionResult', 'eq', 'Unexecuted')
      .or(new SimplePredicate('executionResult', 'eq', 'Failed'));
    let builder = new Builder(store, modelName)
      .selectByProjection('AuditEntityE')
      .orderBy('operationTime')
      .where(predicate);
    return this.get('offlineStore').query(modelName, builder.build()).then((jobs) => {
      dexieService.set('queueSyncUpTotalWorksCount', jobs.get('length'));
      return this._runJobs(store, jobs, continueOnError);
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
    let dexieService = getOwner(_this).lookup('service:dexie');
    dexieService.set('queueSyncUpWorksCount', jobs.get('length'));
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
        dexieService.set('queueSyncUpWorksCount', 0);
        resolve(executedJob);
      }
    });
  },

  /**
  */
  _endJob(job) {
    let dexieService = getOwner(this).lookup('service:dexie');
    return new RSVP.Promise((resolve, reject) => {
      if (job.get('executionResult') === 'Выполнено') {
        RSVP.all(job.get('auditFields').map(field => field.destroyRecord())).then(() => {
          dexieService.set('queueSyncUpCurrentModelName', null);
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
    let dexieService = getOwner(this).lookup('service:dexie');
    dexieService.set('queueSyncUpCurrentModelName', job.get('objectType.name'));

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
    let record = store.peekRecord(job.get('objectType.name'), job.get('objectPrimaryKey'));

    // TODO: Uncomment this after fix bug with load unloaded models.
    // if (record) {
    //   record.rollbackAll();
    //   store.unloadRecord(record);
    // }

    if (!record)
    {
      record = store.createRecord(job.get('objectType.name'), { id: job.get('objectPrimaryKey') });
    }

    record.set('isSyncingUp', true);
    record.set('isCreatedDuringSyncUp', true);

    return this._changesForRecord(store, job).then((changes) => {
      record.setProperties(changes);
      return record.save().then(() => {
        job.set('executionResult', 'Выполнено');
        return job.save();
      }).catch((reason) => {

        // TODO: Resolve conflicts here.
        job.set('executionResult', 'Ошибка');
        Ember.Logger.error(`Sync up model '${job.get('objectType.name')}' creating job error`, reason, record);
        return job.save();
      }).finally(() => {
        if (record) {
          record.set('isSyncingUp', false);
        }
      });
    });
  },

  /**
  */
  _runUpdatingJob(store, job) {
    let query = this._createQuery(store, job);
    return store.queryRecord(query.modelName, query).then((record) => {
      if (record) {
        record.set('isSyncingUp', true);
        return this._changesForRecord(store, job).then((changes) => {
          record.setProperties(changes);
          return record.save().then(() => {
            record.set('isUpdatedDuringSyncUp', true);
            job.set('executionResult', 'Выполнено');
            return job.save();
          }).catch((reason) => {

            // TODO: Resolve conflicts here.
            job.set('executionResult', 'Ошибка');
            Ember.Logger.error(`Sync up model '${query.modelName}' updating job error`, reason, record);
            return job.save();
          }).finally(() => {
            if (record) {
              record.set('isSyncingUp', false);
            }
          });
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
        record.set('isSyncingUp', true);
        return record.destroyRecord().then(() => {
          record.set('isDestroyedDuringSyncUp', true);
          job.set('executionResult', 'Выполнено');
          return job.save();
        }).catch((reason) => {

          // TODO: Resolve conflicts here.
          job.set('executionResult', 'Ошибка');
          Ember.Logger.error(`Sync up model '${query.modelName}' removing job error`, reason, record);
          return job.save();
        }).finally(() => {
          if (record) {
            record.set('isSyncingUp', false);
          }
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
    let userService = getOwner(_this).lookup('service:user');
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
  _changesForRecord(store, job) {
    return new RSVP.Promise((resolve, reject) => {
      let changes = {};
      let promises = [];
      let attributes = get(store.modelFor(job.get('objectType.name')), 'attributes');
      job.get('auditFields').forEach((auditField) => {
        let descriptorField = auditField.get('field').split('@');
        let field = descriptorField.shift();
        let type = descriptorField.shift();
        if (type) {
          let builder = new Builder(store, type).byId(auditField.get('newValue'));
          promises.push(store.queryRecord(type, builder.build()).then((relationship) => {
            changes[field] = relationship;
          }));
        } else {
          switch (attributes.get(field).type) {
            case 'number':
              changes[field] = +auditField.get('newValue');
              break;

            case 'date':
              let date = auditField.get('newValue');
              changes[field] = date ? new Date(date) : null;
              break;

            default:
              changes[field] = auditField.get('newValue');
          }
        }
      });

      RSVP.all(promises).then(() => {
        resolve(changes);
      }, reject);
    });
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

    let changedRelationships = record.changedBelongsTo();
    let snapshot = record._createSnapshot();
    record.eachRelationship((name, descriptor) => {
      let changedRelationship = changedRelationships[name];
      if (changedRelationship && descriptor.kind === 'belongsTo') {
        let relationshipType = descriptor.type;
        if (descriptor.options && descriptor.options.polymorphic) {
          let belongsTo = snapshot.belongsTo(descriptor.key);
          relationshipType = belongsTo.modelName;
        }

        changes[`${name}@${relationshipType}`] = [
          changedRelationship[0] && changedRelationship[0].get('id'),
          changedRelationship[1] && changedRelationship[1].get('id'),
        ];
      }
    });

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
