import Ember from 'ember';
import DS from 'ember-data';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';
import { capitalize, camelize } from '../utils/string-functions';

const { getOwner } = Ember;

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
  headers: Ember.computed(function () {
    if (this.contentTypeCustomHeader) {
      return {
        'OData-Version': '4.0',
        Prefer: 'return=representation',
        'Content-Type': this.contentTypeCustomHeader
      };
    } else {
      return {
        'OData-Version': '4.0',
        Prefer: 'return=representation'
      };
    }
  }).volatile(),

  /**
    Timeout for AJAX-requests.

    @property timeout
    @type Number
    @default 0
  */
  timeout: 0,

  /**
    Custom Content-Type HTTP request header.

    @property contentTypeCustomHeader
    @type String
    @default undefined
  */
  contentTypeCustomHeader: undefined,

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
    Ember.assert('You should specify both method and url', params.method || params.url);
    return Ember.$.ajax(params);
  },

  /**
   * A method to generate url for ajax request to odata function.
   *
   * @param {String} functionName
   * @param {Object} params
   * @param {String} url
   * @return {String}
   */
  generateFunctionUrl(functionName, params, url) {
    const config = getOwner(this)._lookupFactory('config:environment');
    if (Ember.isNone(url)) {
      url = `${config.APP.backendUrls.api}`;
    }

    let resultUrl = `${url}/${functionName}(`;
    let counter = 0;
    for (var key in params) {
      counter++;
    }

    let resultParams = {};
    if (!Ember.isNone(params)) {
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

    return resultUrl;
  },

  /**
   * A method to generate url for ajax request to odata action.
   *
   * @param {String} actionName
   * @param {Oject} data
   * @param {String} url
   * @return {String}
   */
  generateActionUrl(actionName, data, url) {
    const config = getOwner(this)._lookupFactory('config:environment');
    if (Ember.isNone(url)) {
      url = `${config.APP.backendUrls.api}`;
    }

    const resultUrl = `${url}/${actionName}`;

    return resultUrl;
  },

  /**
   * A method to call functions that returns model records using ajax requests.
   *
   * @param {String} functionName
   * @param {Object} params
   * @param {String} url
   * @param {Object} fields
   * @param {DS.Store} store
   * @param {String} modelName
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @public
   */
  callEmberOdataFunction(functionName, params, url, fields, store, modelName, successCallback, failCallback, alwaysCallback) {
    const resultUrl = this.generateFunctionUrl(functionName, params, url);
    return this._callAjax(
      { url: resultUrl, method: 'GET', xhrFields: Ember.isNone(fields) ? {} : fields },
      store, modelName, successCallback, failCallback, alwaysCallback);
  },

  /**
   * A method to call functions using ajax requests.
   *
   * @method callFunction
   * @param {Object} functionName
   * @param {Object} params
   * @param {String} url
   * @param {Object} fields
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @public
   */
  callFunction(functionName, params, url, fields, successCallback, failCallback, alwaysCallback) {
    const resultUrl = this.generateFunctionUrl(functionName, params, url);
    return this._callAjax(
      { url: resultUrl, method: 'GET', xhrFields: Ember.isNone(fields) ? {} : fields },
      null, null, successCallback, failCallback, alwaysCallback);

  },

  /**
   * A method to call actions that returns model records using ajax requests.
   *
   * @param {String} actionName
   * @param {Object} data
   * @param {String} url
   * @param {Object} fields
   * @param {DS.Store} store
   * @param {String} modelName
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @public
   */
  callEmberOdataAction(actionName, data, url, fields, store, modelName, successCallback, failCallback, alwaysCallback) {
    const resultUrl = this.generateActionUrl(actionName, data, url);
    return this._callAjax(
      {
        data: JSON.stringify(data),
        url: resultUrl,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: Ember.isNone(fields) ? {} : fields
      }, store, modelName, successCallback, failCallback, alwaysCallback);
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
    const resultUrl = this.generateActionUrl(actionName, data, url);
    return this._callAjax(
      {
        data: JSON.stringify(data),
        url: resultUrl,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: Ember.isNone(fields) ? {} : fields
      }, null, null, successCallback, failCallback, alwaysCallback);
  },

  /**
   * A method to send batch update, create, delete models in sungle transaction.
   *
   * @method batchUpdate
   * @param {Object} models Is array of models or single model for batch update.
   * @return {Promise} Promise will fulfilled when operation was done.
   * @public
   */
  batchUpdate(store, models) {
    if (!models) {
      // TODO: Обработать эту ситуацию: подумать надо - или бросить исключение, или зарезолвить пустой промис.
      return;
    }

    // TODO: проверить, что пришёл массив, если нет, то засунуть объект в массив.

    // TODO: generate unique boundary id.
    let boundary = 'batch_36522ad7-fc75-4b56-8c71-56071383e77b';

    let requestBody = '--' + boundary + '\r\n';

    // TODO: generate unique changeset id.
    let changeSetBoundary = 'changeset_77162fcd-b8da-41ac-a9f8-9357efbbd';
    requestBody += 'Content-Type: multipart/mixed;boundary=' + changeSetBoundary + '\r\n\r\n';

    let contentId = 0;

    models.forEach((model) => {
      requestBody += '--' + changeSetBoundary + '\r\n';
      requestBody += 'Content-Type: application/http\r\n';
      requestBody += 'Content-Transfer-Encoding: binary\r\n';

      contentId++;
      requestBody += 'Content-ID: ' + contentId + '\r\n\r\n';

      let skipUnchangedAttrs = true;
      let snapshot = model._createSnapshot();
      SnapshotTransform.transformForSerialize(snapshot, skipUnchangedAttrs);

      let modelHttpMethod = 'POST';
      let modelDirtyType = model.get('dirtyType');
      switch (modelDirtyType) {
        case 'created':
          modelHttpMethod = 'POST';
          break;

        case 'updated':
          modelHttpMethod = skipUnchangedAttrs ? 'PATCH' : 'PUT';
          break;

        case 'deleted':
          modelHttpMethod = 'DELETE';
          break;

        default:
          throw new Error(`Unknown requestType: ${modelDirtyType}`);
      }

      let modelUrl =  this._buildURL(snapshot.type.modelName);

      requestBody += modelHttpMethod + ' ' + modelUrl + ' HTTP/1.1\r\n';
      requestBody += 'Content-Type: application/json;type=entry\r\n\r\n';

      let data;

      // Don't need to send any data for deleting.
      if (modelDirtyType !== 'deleted') {
        let serializer = store.serializerFor(snapshot.type.modelName);
        data = {};
        serializer.serializeIntoHash(data, snapshot.type, snapshot);
      }

      requestBody += JSON.stringify(data) + '\r\n';
    });

    requestBody += '--' + changeSetBoundary + '--\r\n';

    requestBody += '\r\n--' + boundary + '--';

    var url = [];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();

    url.push('$batch');

    if (prefix) {
      url.unshift(prefix);
    }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    let httpMethod = 'POST';

    let options = {
      method: httpMethod,
      headers: {
        'OData-Version': '4.0',
        'Prefer': 'return=representation',
        'Content-Type': 'multipart/mixed;boundary=' + boundary,
      },
      dataType: 'text',
      data: requestBody,
    };

    return Ember.$.ajax(url, options).done(function (response) {
      return response;
    });
  },

  /**
   * A method to make ajax requests.
   *
   * @param {Object} params
   * @param {Store} store
   * @param {String} modelname
   * @param {Function} successCallback
   * @param {Function} failCallback
   * @param {Function} alwaysCallback
   * @return {Promise}
   * @private
   */
  _callAjax(params, store, modelname, successCallback, failCallback, alwaysCallback) {
    Ember.assert('Params must be Object!', typeof params === 'object');
    Ember.assert('params.method or params.url is not defined.', !(Ember.isNone(params.method) || Ember.isNone(params.url)));

    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax(params).done((msg) => {
        if (!Ember.isNone(store) && !Ember.isNone(modelname)) {
          const normalizedRecords = { data: [] };
          Object.values(msg.value).forEach(record => {
            normalizedRecords.data.push(store.normalize(modelname, record).data);
          });
          msg = store.push(normalizedRecords);
        }

        if (!Ember.isNone(successCallback)) {
          if (typeof successCallback.then === 'function') {
            if (!Ember.isNone(alwaysCallback)) {
              if (typeof alwaysCallback.then === 'function') {
                successCallback(msg).then(() => { alwaysCallback(msg).then(resolve(msg)); });
              } else {
                successCallback(msg).then(alwaysCallback(msg)).then(resolve(msg));
              }
            } else {
              successCallback(msg).then(resolve(msg));
            }
          } else {
            successCallback(msg);
            if (!Ember.isNone(alwaysCallback)) {
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
          if (!Ember.isNone(alwaysCallback)) {
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
      }).fail((msg) => {
        if (!Ember.isNone(failCallback)) {
          if (typeof failCallback.then === 'function') {
            if (!Ember.isNone(alwaysCallback)) {
              if (typeof alwaysCallback.then === 'function') {
                failCallback(msg).then(() => { alwaysCallback(msg).then(reject(msg)); });
              } else {
                failCallback(msg).then(alwaysCallback(msg)).then(reject(msg));
              }

            } else {
              failCallback(msg).then(reject(msg));
            }

          } else {
            failCallback(msg);
            if (!Ember.isNone(alwaysCallback)) {
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
          if (!Ember.isNone(alwaysCallback)) {
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
    let pathName = this.pathForType(modelName);
    let builder = new ODataQueryAdapter(url, store);
    let filterVelue = builder._buildODataFilters(filter);
    let filterQuery = !Ember.isNone(filterVelue) ? '$filter=' + filterVelue : '';
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

    return this.ajax(url, httpMethod, { data: data }).then(function (response) {
      return response;
    });
  }
});
