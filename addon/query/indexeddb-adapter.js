import Ember from 'ember';

import BaseAdapter from './base-adapter';

/**
 * Class of query language adapter that allows to load data from IndexedDB.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class IndexedDbAdapter
 * @extends Query.BaseAdapter
 */
export default class extends BaseAdapter {
  constructor(databaseName) {
    super();

    if (!databaseName) {
      throw new Error('Database name is not specified');
    }

    this._databaseName = databaseName;
    this._db = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  }

  /**
   * Loads data from IndexedDB.
   *
   * @method query
   * @returns {Ember.RSVP.Promise} Promise with loaded data.
   * @public
   */
  query() {
    let indexedDB = this._db;
    let dbName = this._databaseName;

    return new Ember.RSVP.Promise((resolve, reject) => {
      let request = indexedDB.open(dbName);
      request.onerror = () => {
        reject();
      };

      request.onsuccess = () => {
        // TODO: load data from IndexedDB
        resolve([1, 2, 3]);
      };
    });
  }
}
