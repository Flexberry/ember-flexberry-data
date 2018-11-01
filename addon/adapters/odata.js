import { assert, debug } from '@ember/debug';
import { isNone } from '@ember/utils';
import { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import RSVP from 'rsvp';
import $ from 'jquery';
import DS from 'ember-data';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';
import { capitalize, camelize } from '../utils/string-functions';
import { pluralize } from 'ember-inflector';


/**
 * The OData adapter class.
 * Uses Flexberry Query as a language for requesting server.
 *
 * @module ember-flexberry-data
 * @class OData
 * @extends DS.RESTAdapter
 * @public
 */
export default DS.RESTAdapter.extend({
  headers: computed(function() {
    return {
      'Prefer': 'return=representation'
    };
  }),

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

    debug(`Flexberry ODataAdapter::query '${type}'`, data);

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
    debug(`Flexberry ODataAdapter::queryRecord '${type}'`, query);

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
  /* eslint-disable no-unused-vars */
  findRecord(store, type, id, snapshot) {
    debug(`Flexberry ODataAdapter::findRecord '${type}(${id})'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* eslint-enable no-unused-vars */
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
  /* eslint-disable no-unused-vars */
  findAll(store, type, sinceToken, snapshotRecordArray) {
    debug(`Flexberry ODataAdapter::findAll '${type}'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* eslint-enable no-unused-vars */
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
    return pluralize(capitalized);
  },

  /**
   * A method to make ajax requests.
   *
   * @method makeRequest
   * @param {Object} params
   * @public
   */
  makeRequest(params) {
    assert('You should specify both method and url', params.method || params.url);
    return $.ajax(params);
  },

  /**
   * A method to call functions using ajax requests.
   *
   * @method callFunction
   * @param {Object} functionName
   * @param {Object} params
   * @param {string} url
   * @param {Object} fields
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @public
   */
  callFunction(functionName, params, url, fields, successCallback, failCallback, alwaysCallback) {
    if (isNone(url)) {
      let config = getOwner(this).factoryFor('config:environment').class;
      url = `${config.APP.backendUrls.api}`;
    }

    let resultUrl = `${url}/${functionName}(`;
    let counter = 0;
    for (var key in params) {
      counter++;
    }

    let resultParams = {};
    if (!isNone(params)) {
      resultParams = params;
    }

    let i = 0;
    for (key in resultParams) {
      //TODO: Check types and ''
      if (typeof resultParams[key] === 'number') {
        resultUrl = resultUrl + `${key}=${resultParams[key]}`;
      } else {
        resultUrl = resultUrl + `${key}='${resultParams[key]}'`;
      }

      i++;
      if (i < counter) {
        resultUrl += ',';
      } else {
        resultUrl += ')';
      }
    }

    if (resultUrl[resultUrl.length - 1] !== ')') {
      resultUrl += ')';
    }

    let resultFields = {};
    if (!isNone(fields)) {
      resultFields = fields;
    }

    return this._callAjax({ url: resultUrl, method: 'GET', xhrFields: resultFields }, successCallback, failCallback, alwaysCallback);

  },

  /**
   * A method to call actions using ajax requests.
   *
   * @method callFunction
   * @param {String} actionName
   * @param {Object} data
   * @param {String} url
   * @param {Object} fields
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @public
   */
  callAction(actionName, data, url, fields, successCallback, failCallback, alwaysCallback) {
    if (isNone(url)) {
      let config = getOwner(this).factoryFor('config:environment').class;
      url = `${config.APP.backendUrls.api}`;
    }

    data = JSON.stringify(data);
    url =  `${url}/${actionName}`;

    let resultFields = {};
    if (!isNone(fields)) {
      resultFields = fields;
    }

    return this._callAjax(
      { data: data, url: url, method: 'POST', contentType: 'application/json; charset=utf-8', dataType: 'json', xhrFields: resultFields },
      successCallback,
      failCallback,
      alwaysCallback);
  },

  /**
   * A method to make ajax requests.
   *
   * @method _callAjax
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @private
   */
  _callAjax(params, successCallback, failCallback, alwaysCallback) {
    assert('Params must be Object!', typeof params === 'object');
    assert('params.method or params.url is not defined.', !(isNone(params.method) || isNone(params.url)));

    return new RSVP.Promise(function(resolve, reject) {
      $.ajax(params).done((msg) => {
        if (!isNone(successCallback)) {
          if (typeof successCallback.then === 'function') {
            if (!isNone(alwaysCallback)) {
              if (typeof alwaysCallback.then === 'function') {
                successCallback(msg).then(() => {alwaysCallback(msg).then(resolve(msg));});
              } else {
                successCallback(msg).then(alwaysCallback(msg)).then(resolve(msg));
              }
            } else {
              successCallback(msg).then(resolve(msg));
            }
          } else {
            successCallback(msg);
            if (!isNone(alwaysCallback)) {
              if (typeof alwaysCallback.then === 'function') {
                alwaysCallback(msg).then(resolve(msg));
              } else {
                alwaysCallback(msg);
                resolve(msg);
              }
            } else {
              resolve(msg);
            }
          }
        } else {
          if (!isNone(alwaysCallback)) {
            if (typeof alwaysCallback.then === 'function') {
              alwaysCallback(msg).then(resolve(msg));
            } else {
              alwaysCallback(msg);
              resolve(msg);
            }
          } else {
            resolve(msg);
          }
        }
      }).fail((msg)=> {
        if (!isNone(failCallback)) {
          if (typeof failCallback.then === 'function') {
            if (!isNone(alwaysCallback)) {
              if (typeof alwaysCallback.then === 'function') {
                failCallback(msg).then(() => {alwaysCallback(msg).then(reject(msg));});
              } else {
                failCallback(msg).then(alwaysCallback(msg)).then(reject(msg));
              }

            } else {
              failCallback(msg).then(reject(msg));
            }

          } else {
            failCallback(msg);
            if (!isNone(alwaysCallback)) {
              if (typeof alwaysCallback === 'function') {
                alwaysCallback(msg).then(reject(msg));
              } else {
                alwaysCallback(msg);
                reject(msg);
              }
            } else {
              reject(msg);
            }
          }
        } else {
          if (!isNone(alwaysCallback)) {
            if (typeof alwaysCallback.then === 'function') {
              alwaysCallback(msg).then(reject(msg));
            } else {
              alwaysCallback(msg);
              reject(msg);
            }
          } else {
            reject(msg);
          }
        }
      });
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
    var host = get(this, 'host');
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
      url = this._appendIdToURL(id, url, modelName);
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
  _appendIdToURL(id, url, modelName) {
    let encId = encodeURIComponent(id);
    let model = this.store.modelFor(modelName);
    if (model.idType === 'string') {
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

  deleteAllRecords(store, modelName, filter) {
    let url = this._buildURL(modelName);
    let pathName  = this.pathForType(modelName);
    let builder = new ODataQueryAdapter(url, store);
    let filterVelue = builder._buildODataFilters(filter);
    let filterQuery = !isNone(filterVelue) ? '$filter=' + filterVelue : '';
    let data = { pathName: pathName, filterQuery: filterQuery };

    return this.callAction('DeleteAllSelect', data, null, { withCredentials: true });
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
