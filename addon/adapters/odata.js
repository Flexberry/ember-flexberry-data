import Ember from 'ember';
import DS from 'ember-data';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';

/**
 * The OData adapter class.
 * Uses Flexberry Query as a language for requesting server.
 *
 * @module ember-flexberry-data
 * @namespace DS
 * @class ODataAdapter
 * @extends DS.RESTAdapter
 * @public
 */
export default DS.RESTAdapter.extend({
  headers: {
    Prefer: 'return=representation'
  },

  idType: 'number',

  /**
   * Overloaded method from `RESTAdapter` (Ember Data).
   * Called by the sore in order to fetch data from the server.
   *
   * @method query
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {Query} query Flexberry Query object.
   * @return {Promise}
   */
  query(store, type, query) {
    let host = Ember.get(this, 'host');
    let builder = new ODataQueryAdapter(host, store);
    let url = builder.getODataBaseUrl(query);
    let data = builder.getODataQuery(query);

    if (this.sortQueryParams) {
      data = this.sortQueryParams(data);
    }

    Ember.Logger.debug(`Flexberry ODataAdapter::query '${type}'`, data);

    // TODO: think about moving request execution into query adapter
    return this.ajax(url, 'GET', { data: data });
  },

  /**
   * Overloaded method from `RESTAdapter` (Ember Data).
   * Called by the sore in order to fetch single record from the server.
   *
   * @method queryRecord
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {Query} query
   * @return {Promise} promise
   */
  queryRecord(store, type, query) {
    Ember.Logger.debug(`Flexberry ODataAdapter::queryRecord '${type}'`, query);

    return this.query(store, type, query);
  },

  /**
   * Overloaded method from `RESTAdapter` (Ember Data).
   * Called by the sore in order to fetch single record by ID from the server.
   *
   * @method findRecord
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {String} id
   * @param {DS.Snapshot} snapshot
   * @return {Promise} promise
  */
  /* jshint unused:vars */
  findRecord(store, type, id, snapshot) {
    Ember.Logger.debug(`Flexberry ODataAdapter::findRecord '${type}(${id})'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* jshint unused:true */

  /**
   * Overloaded method from `RESTAdapter` (Ember Data).
   * Called by the sore in order to fetch all records from the server.
   *
   * @method findAll
   * @param {DS.Store} store
   * @param {DS.Model} type
   * @param {String} sinceToken
   * @param {DS.SnapshotRecordArray} snapshotRecordArray
   * @return {Promise} promise
   */
  /* jshint unused:vars */
  findAll(store, type, sinceToken, snapshotRecordArray) {
    Ember.Logger.debug(`Flexberry ODataAdapter::findAll '${type}'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* jshint unused:true */

  createRecord(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'createRecord');
  },

  updateRecord(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'updateRecord');
  },

  deleteRecord(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'deleteRecord');
  },

  /**
   * Makes HTTP request for creating, updating or deleting the record.
   *
   * @method _sendRecord
   * @private
   */
  _sendRecord(store, type, snapshot, requestType) {
    // TODO: maybe move it into serializer (serialize or serializeIntoHash)?
    let skipUnchangedAttrs = true;
    SnapshotTransform.transformForSerialize(snapshot, skipUnchangedAttrs);

    // NOTE: for newly created records id is not defined.
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, requestType);

    let httpMethod;
    switch (requestType) {
      case 'createRecord':
        httpMethod = 'POST';
        break;

      case 'updateRecord':
        httpMethod = skipUnchangedAttrs ? 'PATCH' : 'PUT';
        break;

      case 'deleteRecord':
        httpMethod = 'DELETE';
        break;

      default:
        throw new Error(`Unknown requestType: ${requestType}`);
    }

    let data;

    // Don't need to send any data for deleting.
    if (requestType !== 'deleteRecord') {
      let serializer = store.serializerFor(type.modelName);
      data = {};
      serializer.serializeIntoHash(data, type, snapshot);
    }

    return this.ajax(url, httpMethod, { data: data }).then(function(response) {
      return response;
    });
  }
});
