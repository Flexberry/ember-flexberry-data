import Ember from 'ember';
import DS from 'ember-data';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';
import { capitalize, camelize } from '../utils/string-functions';

/**
 * The OData adapter class.
 * Uses Flexberry Query as a language for requesting server.
 *
 * @module ember-flexberry-data
 * @namespace Adapter
 * @class OData
 * @extends DS.RESTAdapter
 * @public
 */
export default DS.RESTAdapter.extend({
  headers: {
    Prefer: 'return=representation'
  },

  idType: 'number',

  /**
    Timeout for AJAX-requests.

    @property timeout
    @type Number
    @default 0
  */
  timeout: 0,

  /**
    Overloaded method from `RESTAdapter` (Ember Data).
    Called by the sore in order to fetch data from the server.

    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Query} query Flexberry Query object.
    @return {Promise}
  */
  query(store, type, query) {
    let url = this._buildURL(query.modelName);
    let builder = new ODataQueryAdapter(url, store);
    let data = builder.getODataQuery(query);
    let timeout = this.get('timeout');

    if (this.sortQueryParams) {
      data = this.sortQueryParams(data);
    }

    Ember.debug(`Flexberry ODataAdapter::query '${type}'`, data);

    //f TODO: think about moving request execution into query adapter
    return this.ajax(url, 'GET', { data: data, timeout: timeout, dataType: query.dataType || 'json' });
  },

  /**
    Overloaded method from `RESTAdapter` (Ember Data).
    Customizes ajax options for the requests.

    @method ajaxOptions
    @param {String} url
    @param {DS.Model} type
    @param {Object} options
    @return {Object}
  */
  ajaxOptions: function ajaxOptions(url, type, options) {
    let dataType = options.dataType;
    let hash = this._super(...arguments);
    if (dataType === 'blob') {
      hash.dataType = dataType;
    }

    return hash;
  },

  /**
    Takes an ajax response, and returns the json payload or an error.

    @method handleResponse
    @param {Number} status
    @param {Object} headers
    @param {Object} payload
  */
  handleResponse(status, headers, payload) {
    if (!this.isSuccess(status, headers, payload) && typeof payload === 'object' && payload.error) {
      return new DS.AdapterError(payload.error.details, payload.error.message);
    }

    return this._super(...arguments);
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
  /* jshint unused:vars */
  queryRecord(store, type, query) {
    Ember.debug(`Flexberry ODataAdapter::queryRecord '${type}'`, query);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* jshint unused:true */

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
    Ember.debug(`Flexberry ODataAdapter::findRecord '${type}(${id})'`);

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
    Ember.debug(`Flexberry ODataAdapter::findAll '${type}'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* jshint unused:true */

  /**
   * Overloaded method from `build-url-mixin` (Ember Data), that determines the pathname for a given type.
   * Additionally capitalizes the type name (requirement of Flexberry OData Server).
   *
   * @method pathForType
   * @param {String} modelName
   * @return {String} The path for a given type.
   */
  pathForType(modelName) {
    var camelized = camelize(modelName);
    var capitalized = capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  },

  /**
   * A method to make ajax requests.
   *
   * @method makeRequest
   * @param {Object} params
   * @public
   */
  makeRequest(params) {
    if (!params.method || !params.url) {
      return;
    }

    return Ember.$.ajax(params);
  },

  /**
   * A method to make any ajax requests.
   *
   * @method ajaxAbstraction
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @return {Promise}
   * @public
   */
  ajaxAbstraction(params, successCallback, failCallback) {
    if (typeof params !== 'object') {
      throw new Error('Params must be Object!');
    }

    if (Ember.none(params.method) || Ember.none(params.url)) {
      throw new Error('params.method or params.url is not defined.');
    }

    if (!Ember.none(successCallback) && !Ember.none(failCallback)) {
      if (typeof successCallback !== 'function') {
        throw new Error('successCallback must be function!');
      }

      if (typeof failCallback !== 'function') {
        throw new Error('failCallback must be function!');
      }

      if (params.method === 'POST') {
        params.data = JSON.stringify(params.data);
      }

      return Ember.RVSP.Promise(function(resolve, reject) {
        Ember.$.ajax(params).done(successCallback(msg)).fail(failCallback());
      });
    }

    if (!Ember.none(successCallback) && Ember.none(failCallback)) {
      if (typeof successCallback !== 'function') {
        throw new Error('successCallback must be function!');
      }

      if (params.method === 'POST') {
        params.data = JSON.stringify(params.data);
      }

      return Ember.RVSP.Promise(function(resolve, reject) {
        Ember.$.ajax(params).done(successCallback(msg));
      });
    }

    if (!Ember.none(failCallback) && Ember.none(successCallback)) {
      if (typeof failCallback !== 'function') {
        throw new Error('failCallback must be function!');
      }

      if (params.method === 'POST') {
        params.data = JSON.stringify(params.data);
      }

      return Ember.RVSP.Promise(function(resolve, reject) {
        Ember.$.ajax(params).fail(failCallback());
      });
    }

    if (params.method === 'POST') {
      params.data = JSON.stringify(params.data);
    }

    return Ember.RVSP.Promise(function(resolve, reject) {
      Ember.$.ajax(params);
    });
  },

  /**
   * Overloaded method from `build-url-mixin` (Ember Data), taht builds URL to OData feed.
   * Appends id as `(id)` (OData specification) instead of `/id`.
   *
   * @method _buildURL
   * @param {String} modelName
   * @param {String} id
   * @return {String}
   * @private
   */
  _buildURL(modelName, id) {
    var url = [];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();
    var path;

    if (modelName) {
      path = this.pathForType(modelName);
      if (path) {
        url.push(path);
      }
    }

    if (prefix) {
      url.unshift(prefix);
    }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    if (id != null) {
      // Append id as `(id)` (OData specification) instead of `/id`.
      url = this._appendIdToURL(id, url);
    }

    return url;
  },

  /**
   * Appends id to URL according to the OData specification.
   *
   * @method _appendIdToURL
   * @param {String} id
   * @param {String} url
   * @private
   */
  _appendIdToURL(id, url) {
    let encId = encodeURIComponent(id);
    let idType = Ember.get(this, 'idType');
    if (idType !== 'number') {
      encId = `'${encId}'`;
    }

    url += '(' + encId + ')';
    return url;
  },

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
