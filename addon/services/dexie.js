import Ember from 'ember';
import Dexie from 'npm:dexie';

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

  /* Dexie instance */
  _dexie: null
});
