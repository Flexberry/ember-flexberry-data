import { assert, debug } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { Promise, resolve } from 'rsvp';
import $ from 'jquery';
import DS from 'ember-data';
import { run } from '@ember/runloop';
import { A, isArray } from '@ember/array';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';
import { capitalize, camelize } from '../utils/string-functions';
import { pluralize } from 'ember-inflector';
import generateUniqueId from '../utils/generate-unique-id';
import { getResponseMeta, getBatchResponses, parseBatchResponse } from '../utils/batch-queries';


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
      'OData-Version': '4.0',
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
    if (!this.store) {
      this.store = store;
    }

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
   * A method to generate url for ajax request to odata function.
   *
   * @param {String} functionName
   * @param {Object} params
   * @param {String} url
   * @return {String}
   */
  generateFunctionUrl(functionName, params, url) {
    const config = getOwner(this).factoryFor('config:environment').class;
    if (isNone(url)) {
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
    const config = getOwner(this).factoryFor('config:environment').class;
    if (isNone(url)) {
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
      { url: resultUrl, method: 'GET', xhrFields: isNone(fields) ? {} : fields },
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
      { url: resultUrl, method: 'GET', xhrFields: isNone(fields) ? {} : fields },
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
        xhrFields: isNone(fields) ? {} : fields
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
        xhrFields: isNone(fields) ? {} : fields
      }, null, null, successCallback, failCallback, alwaysCallback);
  },

  /**
    A method to send batch update, create or delete models in single transaction.

    It is recommended to create new models with identifiers, otherwise, after saving, the model object in the store will be created anew.

    The array which fulfilled the promise may contain the following values:
    - `new model object` - for records created without client id.
    - `same model object` - for created, updated or unaltered records.
    - `null` - for deleted records.

    @method batchUpdate
    @param {DS.Store} store The store.
    @param {DS.Model[]|DS.Model} models Is array of models or single model for batch update.
    @return {Promise} A promise that fulfilled with an array of models in the new state.
  */
  batchUpdate(store, models) {
    if (isEmpty(models)) {
      if (isArray(models)) {
        return resolve();
      }

      throw new Error('The models is empty.');
    }

    models = A(models);

    const boundary = `batch_${generateUniqueId()}`;

    let requestBody = '--' + boundary + '\r\n';

    const changeSetBoundary = `changeset_${generateUniqueId()}`;
    requestBody += 'Content-Type: multipart/mixed;boundary=' + changeSetBoundary + '\r\n\r\n';

    let contentId = 0;
    const modelsByContentId = {};
    models.forEach((model) => {
      let modelDirtyType = model.get('dirtyType');

      if (!modelDirtyType) {
        return;
      }

      requestBody += '--' + changeSetBoundary + '\r\n';
      requestBody += 'Content-Type: application/http\r\n';
      requestBody += 'Content-Transfer-Encoding: binary\r\n';

      contentId++;
      requestBody += 'Content-ID: ' + contentId + '\r\n\r\n';
      modelsByContentId[contentId] = model;

      const skipUnchangedAttrs = true;
      const snapshot = model._createSnapshot();
      SnapshotTransform.transformForSerialize(snapshot, skipUnchangedAttrs);

      let modelHttpMethod = 'POST';
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

      if (!this.store) {
        this.store = store;
      }

      const modelUrl =  this._buildURL(snapshot.type.modelName, modelDirtyType === 'created' ? undefined : model.get('id'));

      requestBody += modelHttpMethod + ' ' + modelUrl + ' HTTP/1.1\r\n';
      requestBody += 'Content-Type: application/json;type=entry\r\n';
      requestBody += 'Prefer: return=representation\r\n\r\n';

      // Don't need to send any data for deleting.
      if (modelDirtyType !== 'deleted') {
        const serializer = store.serializerFor(snapshot.type.modelName);
        const data = {};
        serializer.serializeIntoHash(data, snapshot.type, snapshot);
        requestBody += JSON.stringify(data) + '\r\n';
      }
    });

    requestBody += '--' + changeSetBoundary + '--\r\n';

    requestBody += '\r\n--' + boundary + '--';

    const url = `${this._buildURL()}/$batch`;

    const headers = $.extend({}, this.get('headers'));
    headers['Content-Type'] = `multipart/mixed;boundary=${boundary}`;
    const httpMethod = 'POST';

    const options = {
      method: httpMethod,
      headers,
      dataType: 'text',
      data: requestBody,
    };

    return new Promise((resolve, reject) => $.ajax(url, options).done((response, statusText, xhr) => {
      const meta = getResponseMeta(xhr.getResponseHeader('Content-Type'));
      if (meta.contentType !== 'multipart/mixed') {
        return reject(new Error('Invalid response type.'));
      }

      const responses = getBatchResponses(response, meta.boundary);
      if (responses.length !== 1) {
        return reject(new Error('Invalid number of responses.'));
      }

      const { contentType, changesets } = parseBatchResponse(responses[0]);
      if (contentType !== 'multipart/mixed') {
        return reject(new Error('Invalid response type.'));
      }

      if (changesets.length === 1 && !this.isSuccess(changesets[0].meta.status)) {
        return reject(new Error('Invalid response.'));
      }

      const result = [];
      for (const model of models) {
        const changeset = changesets.find(c => modelsByContentId[c.contentID] === model);
        const modelClass = store.modelFor(model.constructor.modelName);
        const serializer = store.serializerFor(modelClass.modelName);
        switch (model.get('dirtyType')) {
          case 'created':
            if (changeset.meta.status !== 201) {
              return reject(new Error(`Invalid response status: ${changeset.meta.status}.`));
            }

            if (!model.get('id')) {
              run(store, store.unloadRecord, model);
            }

            result.push(run(store, store.push, serializer.normalize(modelClass, changeset.body)));
            break;

          case 'updated':
            if (changeset.meta.status !== 200) {
              return reject(new Error(`Invalid response status: ${changeset.meta.status}.`));
            }

            result.push(run(store, store.push, serializer.normalize(modelClass, changeset.body)));
            break;

          case 'deleted':
            if (changeset.meta.status !== 204) {
              return reject(new Error(`Invalid response status: ${changeset.meta.status}.`));
            }

            run(store, store.unloadRecord, model);
            result.push(null);
            break;

          default:
            result.push(model);
        }
      }

      resolve(result);
    }).fail(reject));
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
    assert('Params must be Object!', typeof params === 'object');
    assert('params.method or params.url is not defined.', !(isNone(params.method) || isNone(params.url)));

    return new Promise(function(resolve, reject) {
      $.ajax(params).done((msg) => {
        if (!isNone(store) && !isNone(modelname)) {
          const normalizedRecords = { data: [] };
          Object.values(msg.value).forEach(record => {
            normalizedRecords.data.push(store.normalize(modelname, record).data);
          });
          msg = store.push(normalizedRecords);
        }

        if (!isNone(successCallback)) {
          if (typeof successCallback.then === 'function') {
            if (!isNone(alwaysCallback)) {
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
                failCallback(msg).then(() => { alwaysCallback(msg).then(reject(msg)); });
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

    if (!this.store) {
      throw new Error('No store.');
    }

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
    if (!this.store) {
      this.store = store;
    }

    let url = this._buildURL(modelName);
    let pathName = this.pathForType(modelName);
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

    return this.ajax(url, httpMethod, { data: data }).then(function (response) {
      return response;
    });
  }
});
