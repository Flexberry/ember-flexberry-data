/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import Dexie from 'npm:dexie';
import Queue from '../utils/queue';

const { merge } = Ember;

/**
  Service for storing [Dexie](https://github.com/dfahlander/Dexie.js) instance for application.

  @class DexieService
  @namespace Offline
  @extends Ember.Service
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
  /* Queue for requests to Dexie */
  _queue: Queue.create(),

  /**
    Contains instances of Dexie.

    @property _dexie
    @type Object
  */
  _dexie: {},

  /**
    Count of objects that should be synced down.

    @property queueSyncDownWorksCount
    @type Number
    @default 0
  */
  queueSyncDownWorksCount: 0,

  /**
    Count of objects that should be synced up.

    @property queueSyncUpWorksCount
    @type Number
    @default 0
  */
  queueSyncUpWorksCount: 0,

  /**
    Total count of objects that should be synced up on current sync up operation.

    @property queueSyncUpTotalWorksCount
    @type Number
    @default 0
  */
  queueSyncUpTotalWorksCount: 0,

  /**
    Total count of objects that should be synced up on current sync up operation.

    @property queueSyncUpTotalWorksCount
    @type String
    @default null
  */
  queueSyncUpCurrentModelName: null,

  /**
    Allows to enable or disable continuation of performing CRUD operations in queue if error occurs.

    @property queueContinueOnError
    @type Boolean
    @default true
  */
  queueContinueOnError: true,

  init() {
    this.get('_queue').set('continueOnError', this.get('queueContinueOnError'));
  },

  /**
    Return the only instance of Dexie database with specified schemas.
    Schemas are specified in base store in `offlineSchema` property.

    @method dexie
    @param {String} dbName
    @param {DS.Store or subclass} store
    @param {Object} [options]
    @param {Array} [options.addons]
    @param {Boolean} [options.autoOpen]
    @param {IDBFactory} [options.indexedDB]
    @param {IDBKeyRange} [options.IDBKeyRange]
    @return {Dexie} Dexie database.
  */
  dexie(dbName, store, options) {
    let dexie = this.get('_dexie')[dbName];
    if (dexie instanceof Dexie) {
      return dexie;
    }

    let db =  new Dexie(dbName, merge({}, options));
    let schemas = store.get('offlineSchema')[dbName];
    for (let version in schemas) {
      db.version(+version).stores(schemas[version]);
    }

    this.get(`_dexie`)[dbName] = db;
    return db;
  },

  /**
    Add operation to queue of Dexie oprations.

    @method performQueueOperation
    @param {Dexie} db
    @param {Function} operation
    @return {Promise} Promise for added to queue operation.
  */
  performQueueOperation(db, operation) {
    return this._queue.attach((resolve) => {
      if (!db.isOpen()) {
        return db.open().then((db) => {
          operation(db).then(() => {
            resolve();
          });
        });
      } else {
        return operation(db).then(() => {
          resolve();
        });
      }
    });
  },

  /**
    Perform Dexie opration without adding it to queue.

    @method performOperation
    @param {Dexie} db
    @param {Function} operation
    @return {Promise} Result of performed operation.
  */
  performOperation(db, operation) {
    if (!db.isOpen()) {
      return db.open().then((db) => operation(db));
    } else {
      return operation(db);
    }
  },

  /**
    Closes the database. This operation completes immediately and there is no returned Promise.

    @method close
    @param {String} dbName
  */
  close(dbName) {
    let dexie = this.get('_dexie')[dbName];
    if (dexie instanceof Dexie) {
      return dexie.close();
    }
  }
});
