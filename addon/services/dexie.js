import Ember from 'ember';
import Dexie from 'npm:dexie';
import Queue from '../utils/queue';

/**
  @module ember-flexberry-data
*/

/**
  Service for storing [Dexie](https://github.com/dfahlander/Dexie.js) instance for application.

  @class DexieService
  @namespace Offline
  @extends Ember.Service
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
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
    if (!Ember.isNone(this._dexie)) {
      return this._dexie;
    }

    let db =  new Dexie(dbName, Ember.merge({}, options));
    let schemas = store.get(`offlineSchema.${dbName}`);
    for (let version in schemas) {
      db.version(version).stores(schemas[version]);
    }

    return this.set('_dexie', db);
  },

  /**
    Add operation to queue of Dexie oprations.

    @method performQueueOperation
    @param {Dexie} db
    @param {Function} operation
    @return {Promise} Promise for added to queue operation.
  */
  performQueueOperation(db, operation) {
    return this._queue.attach((resolve, reject) => {
      if (!db.isOpen()) {
        db.open().then((db) => {
          operation(db).then(() => {
            resolve();
          }).catch(reject);
        }).catch(reject);
      } else {
        operation(db).then(() => {
          resolve();
        }).catch(reject);
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

  /* Dexie instance */
  _dexie: null,

  /* Queue for requests to Dexie */
  _queue: Queue.create()
});
