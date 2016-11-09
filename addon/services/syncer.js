import Ember from 'ember';
import Builder from '../query/builder';
import { SimplePredicate } from '../query/predicate';
import { reloadLocalRecords, createLocalRecord } from '../utils/reload-local-records';
import isModelInstance from '../utils/is-model-instance';
import Queue from '../utils/queue';

const { RSVP, isNone, isArray, getOwner, get } = Ember;

/**
  @class Syncer
  @namespace Offline
  @extends Ember.Object
*/
export default Ember.Service.extend({
  /* Queue of promises for syncDown */
  _syncDownQueue: Queue.create(),

  /**
    Store that use for making requests in offline mode.
    By default it is set to global instane of {{#crossLink "LocalStore"}}{{/crossLink}} class.

    @property offlineStore
    @type <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  */
  offlineStore: undefined,

  /**
    Number of "main" records (include related records for relationships) that should be accumulated before bulk operation will be performed.

    @property numberOfRecordsForPerformingBulkOperations
    @type Number
    @default 10
  */
  numberOfRecordsForPerformingBulkOperations: 10,

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
   * @return {Promise}
   */
  syncDown: function(descriptor, reload, projectionName, params) {
    let _this = this;

    let bulkUpdateOrCreateCall = (record, resolve, reject) => {
      let localStore = _this.get('offlineStore');
      let modelName = record.constructor.modelName;
      let localAdapter = localStore.adapterFor(modelName);
      localAdapter.bulkUpdateOrCreate(localStore, true, false).then(() => {
        resolve(record);
      }, reject);
    };

    if (typeof descriptor === 'string') {
      return reloadLocalRecords.call(this, descriptor, reload, projectionName, params);

    } else if (isModelInstance(descriptor)) {
      let store = getOwner(this).lookup('service:store');
      return _this._syncDownQueue.attach((resolve, reject) => {
        return _this._syncDownRecord(store, descriptor, reload, projectionName, params).then(() => {
          bulkUpdateOrCreateCall(descriptor, resolve, reject);
        }, reject);
      });
    } else if (isArray(descriptor)) {
      let store = getOwner(this).lookup('service:store');
      let recordsCount =  descriptor.get ? descriptor.get('length') : descriptor.length;
      let accumulatedRecordsCount = 0;
      let updatedRecords = descriptor.map(function(record) {
        return _this._syncDownQueue.attach((resolve, reject) => {
          return _this._syncDownRecord(store, record, reload, projectionName, params).then(() => {
            accumulatedRecordsCount++;
            if ((accumulatedRecordsCount % _this.numberOfRecordsForPerformingBulkOperations === 0) || accumulatedRecordsCount === recordsCount) {
              bulkUpdateOrCreateCall(record, resolve, reject);
            } else {
              resolve(record);
            }
          }, reject);
        });
      });
      return RSVP.all(updatedRecords);

    } else {
      throw new Error('Input for sync down can only be a string, a DS.Model or an array of DS.Model, but is ' + descriptor);
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
   * @param {DS.Store or Subclass} store Store of application.
   * @param {DS.Model} record Record to save in local store.
   * @param {Boolean} [reload] If set to true then syncer perform remote reload for data, otherwise data will get from the store.
   * @param {String} [projectionName] Name of projection for remote reload of data. If not set then all properties of record, except navigation properties, will be read.
   * @param {Object} [params] Additional parameters for syncing down.
   * @param {Query.QueryObject} [params.queryObject] QueryObject instance to make query if descriptor is a typeName.
   * @param {Boolean} [params.unloadSyncedRecords] If set to true then synced records will be unloaded from online store.
   * @private
   */
  _syncDownRecord: function(store, record, reload, projectionName, params) {
    var _this = this;

    function saveRecordToLocalStore(store, record, projectionName) {
      let modelName = record.constructor.modelName;
      let modelType = store.modelFor(modelName);
      let projection = isNone(projectionName) ? null : modelType.projections[projectionName];
      let localStore = this.get('offlineStore');
      let localAdapter = localStore.adapterFor(modelName);

      if (record.get('isDeleted')) {
        let snapshot = record._createSnapshot();
        return localAdapter.deleteRecord(localStore, snapshot.type, snapshot).then(() => {
          let dexieService = getOwner(_this).lookup('service:dexie');
          dexieService.set('queueSyncDownWorksCount', dexieService.get('queueSyncDownWorksCount') - 1);
          return record;
        }).catch((reason) => {
          Ember.Logger.error(reason);
        });
      } else {
        return createLocalRecord.call(_this, store, localAdapter, localStore, modelType, record, projection, params);
      }
    }

    if (reload) {
      let modelName = record.constructor.modelName;
      let options = {
        reload: true,
        useOnlineStore: true
      };
      options = isNone(projectionName) ? options : Ember.$.extend(true, options, { projection: projectionName });
      return new Ember.RSVP.Promise((resolve, reject) => {
        store.findRecord(modelName, record.id, options).then(function(reloadedRecord) {

          // TODO: Uncomment this after fix bug with load unloaded models.
          // store.get('onlineStore').unloadRecord(reloadedRecord);
          saveRecordToLocalStore.call(_this, store, reloadedRecord, projectionName).then(() => {
            resolve(record);
          }, reject);
        });
      });
    } else {
      return saveRecordToLocalStore.call(_this, store, record, projectionName);
    }
  },

  /**
    Start sync up process.

    @method syncUp
    @param {Ember.Array} [jobs] Array instances of `auditEntity` model for sync up.
    @param {Object} [options] Object with options for sync up.
    @param {Boolean} [options.continueOnError] If `true` continue sync up if an error occurred.
    @return {Promise}
  */
  syncUp(jobs, options) {
    let builder;
    let predicate;
    let store = getOwner(this).lookup('service:store');
    let dexieService = getOwner(this).lookup('service:dexie');
    let modelName = 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity';
    if (!jobs) {
      predicate = new SimplePredicate('executionResult', 'eq', 'Unexecuted')
        .or(new SimplePredicate('executionResult', 'eq', 'Failed'));
      builder = new Builder(store, modelName)
        .selectByProjection('AuditEntityE')
        .orderBy('operationTime')
        .where(predicate);
    }

    return (jobs ? RSVP.resolve(jobs) : this.get('offlineStore').query(modelName, builder.build())).then((jobs) => {
      dexieService.set('queueSyncUpTotalWorksCount', jobs.get('length'));
      return this._runJobs(store, jobs, options && options.continueOnError);
    });
  },

  /**
    This method is called when a sync process if at attempt create, update or delete record, server error return.
    Default behavior: Marked `job` as 'Ошибка', execute further when called `syncUp` method.

    @example
      ```javascript
      // app/services/syncer.js
      import { Offline } from 'ember-flexberry-data';

      export default Offline.Syncer.extend({
        ...
        resolveServerError(job, error) {
          let _this = this;
          return new Ember.RSVP.Promise((resolve, reject) => {
            // Here `error.status` as example, as if user not authorized on server.
            if (error.status === 401) {
              // As if `auth` function authorize user.
              auth().then(() => {
                _this.syncUp(Ember.A([job])).then(() => {
                  job.set('executionResult', 'Выполнено');
                  resolve(job.save());
                }, reject);
              }, reject);
            } else {
              job.set('executionResult', 'Ошибка');
              resolve(job.save());
            }
          });
        },
        ...
      });

      ```

    @method resolveServerError
    @param {subclass of DS.Model} job Instance of `auditEntity` model when restore which error occurred.
    @param {Object} error
    @return {Promise} Promise that resolves updated job.
  */
  resolveServerError(job, error) {
    Ember.Logger.debug(`Error sync up:'${job.get('operationType')}' - '${job.get('objectType.name')}:${job.get('objectPrimaryKey')}'.`, error);
    job.set('executionResult', 'Ошибка');
    return job.save();
  },

  /**
    This method is called when a sync process not found record on server for delete or update.
    Default behavior: Marked `job` as 'Не выполнено', not delete and not execute further when called `syncUp` method.

    @example
      ```javascript
      // app/services/syncer.js
      import { Offline } from 'ember-flexberry-data';

      export default Offline.Syncer.extend({
        ...
        resolveNotFoundRecord(job) {
          if (job.get('operationType') === 'UPDATE') {
            // It will be executed when next called `syncUp` method.
            job.set('executionResult', 'Ошибка');
          } else if (job.get('operationType') === 'DELETE') {
            // It will be immediately delete and not never executed.
            job.set('executionResult', 'Выполнено');
          }

          return job.save();
        },
        ...
      });

      ```

    @method resolveNotFoundRecord
    @param {subclass of DS.Model} job Instance of `auditEntity` model when restore which error occurred.
    @return {Promise} Promise that resolves updated job.
  */
  resolveNotFoundRecord(job) {
    job.set('executionResult', 'Не выполнено');
    return job.save();
  },

  /**
  */
  createJob(record) {
    return new RSVP.Promise((resolve, reject) => {
      this._createAuditEntity(record).then((auditEntity) => {
        this._createAuditFields(auditEntity, record).then(resolve, reject);
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
        }, reject);
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
        }, reject);
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
      }).catch(reason => this.resolveServerError(job, reason)).finally(() => {
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
          }).catch(reason => this.resolveServerError(job, reason)).finally(() => {
            if (record) {
              record.set('isSyncingUp', false);
            }
          });
        });
      } else {
        return this.resolveNotFoundRecord(job);
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
        }).catch(reason => this.resolveServerError(job, reason)).finally(() => {
          if (record) {
            record.set('isSyncingUp', false);
          }
        });
      } else {
        return this.resolveNotFoundRecord(job);
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
            if (auditEntity.get('operationType') === 'INSERT') {
              delete auditData.operationType;
            }

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
          let value = auditField.get('newValue');
          switch (attributes.get(field).type) {
            case 'boolean':
              changes[field] = value === null ? null : !!value;
              break;

            case 'number':
              changes[field] = value === null ? null : +value;
              break;

            case 'date':
              changes[field] = value === null ? null : new Date(value);
              break;

            default:
              changes[field] = value;
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
