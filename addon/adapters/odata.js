import { assert, debug } from '@ember/debug';
import { deprecate } from '@ember/application/deprecations';
import { isNone, isEmpty } from '@ember/utils';
import { get, set, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { Promise, all, resolve } from 'rsvp';
import $ from 'jquery';
import DS from 'ember-data';
import { run } from '@ember/runloop';
import { A, isArray } from '@ember/array';

import SnapshotTransform from '../utils/snapshot-transform';
import ODataQueryAdapter from '../query/odata-adapter';
import { capitalize, camelize, dasherize, odataPluralize, odataSingularize } from '../utils/string-functions';
import isUUID from '../utils/is-uuid';
import generateUniqueId from '../utils/generate-unique-id';
import { getResponseMeta, getBatchResponses, parseBatchResponse } from '../utils/batch-queries';
import Builder from '../query/builder';


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
  queryRecord(store, type, query) {
    debug(`Flexberry ODataAdapter::queryRecord '${type}'`, query);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
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
  /* eslint-disable no-unused-vars */
  findRecord(store, type, id, snapshot) {
    debug(`Flexberry ODataAdapter::findRecord '${type}(${id})'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* eslint-enable no-unused-vars */

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
  /* eslint-disable no-unused-vars */
  findAll(store, type, sinceToken, snapshotRecordArray) {
    debug(`Flexberry ODataAdapter::findAll '${type}'`);

    // TODO: query support for direct calls
    return this._super.apply(this, arguments);
  },
  /* eslint-enable no-unused-vars */

  /**
   * Overloaded method from `build-url-mixin` (Ember Data), that determines the pathname for a given type.
   * Additionally capitalizes the type name (requirement of Flexberry OData Server).
   *
   * @method pathForType
   * @param {String} modelName
   * @return {String} The path for a given type.
   */
  pathForType(modelName) {
    let camelized = camelize(modelName);
    let capitalized = capitalize(camelized);
    return odataPluralize(capitalized);
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
      if (typeof resultParams[key] === 'number' || isUUID(resultParams[key])) {
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
    A method to generate url for ajax request to odata action.

    @method generateActionUrl
    @param {String} actionName
    @param {Object} data
    @param {String} url
    @return {String}
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
    A method to call OData functions that returns model records using ajax request.

    @method callEmberOdataFunction
    @param {Object} args Method arguments.
    @param {Object} args.functionName OData functioin name (required).
    @param {Object} args.params OData function parameters.
    @param {String} args.url Backend url.
    @param {Object} args.fields Request's xhrFields.
    @param {Object} args.store Ember's store.
    @param {String} args.modelName Model name.
    @param {String} args.modelProjection Model projection.
    @param {Function} args.successCallback Success callback.
    @param {Function} args.failCallback Fail callback.
    @param {Function} args.alwaysCallback Always callback.
    @return {Promise}
  */
  callEmberOdataFunction(args) {
    deprecate('callEmberOdataFunction is deprecated. Use callFunction with single args argument instead.', false, {
      id: 'adapter.odata.callEmberOdataFunction',
      until: '3.5.0',
    });

    if (arguments.length > 1 || typeof args !== 'object') {
      args = this._getODataArgs(arguments, true);
    }

    return this.callFunction(args);
  },

  /**
    A method to call OData functions using ajax request.

    @method callFunction
    @param {Object} args Method arguments.
    @param {Object} args.functionName OData functioin name (required).
    @param {Object} args.params OData function parameters.
    @param {String} args.url Backend url.
    @param {Object} args.fields Request's xhrFields.
    @param {Object} args.store Ember's store, needed when results are ember models.
    @param {String} args.modelName Model name, needed when results are ember models.
    @param {String} args.modelProjection Model projection, needed when results are ember models.
    @param {Function} args.successCallback Success callback.
    @param {Function} args.failCallback Fail callback.
    @param {Function} args.alwaysCallback Always callback.
    @return {Promise}
  */
  callFunction(args) {
    if (arguments.length > 1 || typeof args !== 'object') {
      args = this._getODataArgs(arguments);
    }

    if (args.modelProjection && args.modelName && args.store) {
      const builder = new Builder(args.store, args.modelName).selectByProjection(args.modelProjection);
      args.queryParams = builder.build();
    }

    let resultUrl = this.generateFunctionUrl(args.functionName, args.params, args.url);

    if (args.queryParams && args.store) {
      const queryParamsForUrl = this._generateFunctionQueryString(args.queryParams, args.store);
      resultUrl += queryParamsForUrl;
    }

    const headers = $.extend({}, this.get('headers'));

    return this._callAjax(
      { url: resultUrl, method: 'GET', headers, xhrFields: args.fields ? args.fields : {} },
      args.store, args.modelName, args.successCallback, args.failCallback, args.alwaysCallback);
  },

  /**
    A method to call OData actions that returns model records using ajax request.

    @method callEmberOdataAction
    @param {Object} args Method arguments.
    @param {Object} args.actionName OData action name (required).
    @param {Object} args.data OData action data.
    @param {String} args.url Backend url.
    @param {Object} args.fields Request's xhrFields.
    @param {Object} args.store Ember's store.
    @param {String} args.modelName Model name.
    @param {Function} args.successCallback Success callback.
    @param {Function} args.failCallback Fail callback.
    @param {Function} args.alwaysCallback Always callback.
    @return {Promise}
  */
  callEmberOdataAction(args) {
    deprecate('callEmberOdataAction is deprecated. Use callAction with single args argument instead.', false, {
      id: 'adapter.odata.callEmberOdataAction',
      until: '3.5.0',
    });

    if (arguments.length > 1 || typeof args !== 'object') {
      args = this._getODataArgs(arguments, true, true);
    }

    return this.callAction(args);
  },

  /**
    A method to call OData actions using ajax request.

    @method callAction
    @param {Object} args Method arguments.
    @param {Object} args.actionName OData action name (required).
    @param {Object} args.data OData action data.
    @param {String} args.url Backend url.
    @param {Object} args.fields Request's xhrFields.
    @param {Object} args.store Ember's store, needed when results are ember models.
    @param {String} args.modelName Model name, needed when results are ember models.
    @param {Function} args.successCallback Success callback.
    @param {Function} args.failCallback Fail callback.
    @param {Function} args.alwaysCallback Always callback.
    @return {Promise}
  */
  callAction(args) {
    if (arguments.length > 1 || typeof args !== 'object') {
      args = this._getODataArgs(arguments, false, true);
    }

    const resultUrl = this.generateActionUrl(args.actionName, args.data, args.url);
    const headers = $.extend({}, this.get('headers'));

    return this._callAjax(
      {
        data: JSON.stringify(args.data || {}),
        url: resultUrl,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers,
        xhrFields: args.fields ? args.fields : {}
      }, args.store, args.modelName, args.successCallback, args.failCallback, args.alwaysCallback);
  },

  /**
    A method to send batch update, create or delete models in single transaction.

    All models saving using this method must have identifiers.

    The array which fulfilled the promise may contain the following values:
    - `same model object` - for created, updated or unaltered records.
    - `null` - for deleted records.

    @method batchUpdate
    @param {DS.Store} store The store.
    @param {DS.Model[]|DS.Model} models Is array of models or single model for batch update.
    @param {Object} getProjections Optional projections for updated models.
    @return {Promise} A promise that fulfilled with an array of models in the new state.
  */
  batchUpdate(store, models, getProjections = {}) {
    if (isEmpty(models)) {
      return resolve(models);
    }

    models = isArray(models) ? models : A([models]);

    return all(models.map((m) => m.save({ softSave: true }))).then(() => {
      const boundary = `batch_${generateUniqueId()}`;

      let requestBody = '--' + boundary + '\r\n';

      const changeSetBoundary = `changeset_${generateUniqueId()}`;
      requestBody += 'Content-Type: multipart/mixed;boundary=' + changeSetBoundary + '\r\n\r\n';

      let contentId = 0;
      const getQueries = [];
      models.forEach((model) => {
        if (!model.get('id')) {
          throw new Error(`Models saved using the 'batchUpdate' method must be created with identifiers.`);
        }

        let modelDirtyType = model.get('dirtyType');

        if (!modelDirtyType) {
          if (model.hasChangedBelongsTo() || model.hasChangedHasMany()) {
            modelDirtyType = 'updated';
          } else {
            return;
          }
        }

        requestBody += '--' + changeSetBoundary + '\r\n';
        requestBody += 'Content-Type: application/http\r\n';
        requestBody += 'Content-Transfer-Encoding: binary\r\n';

        contentId++;
        requestBody += 'Content-ID: ' + contentId + '\r\n\r\n';

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
          const modelName = snapshot.type.modelName;
          const serializer = store.serializerFor(modelName);
          const data = {};
          serializer.serializeIntoHash(data, snapshot.type, snapshot);
          requestBody += JSON.stringify(data) + '\r\n';

          // Add a GET request for created or updated models.
          let getQuery = '\r\n--' + boundary + '\r\n';
          getQuery += 'Content-Type: application/http\r\n';
          getQuery += 'Content-Transfer-Encoding: binary\r\n';

          const getUrl = this._buildURL(modelName, model.get('id'));

          const projection = get(getProjections, modelName);
          if (isNone(projection)) {
            const relationships = [];
            model.eachRelationship((name) => {
              // If attr serializable value hadn't been set up, it'll be { serialize: 'id' } by default from DS.EmbeddedRecordsMixin.
              let attrSerializeVal =
                serializer && serializer.attrs && serializer.attrs[name] && serializer.attrs[name].serialize;
  
              if (attrSerializeVal !== false) {
                relationships.push(`${name}.id`);
              }
            });
  
            let expand;
            if (relationships.length) {
              const query = new Builder(store, modelName).select(relationships.join(',')).build();
              const queryAdapter = new ODataQueryAdapter(getUrl, store);
              expand = queryAdapter.getODataQuery(query).$expand;
            }

            getQuery += '\r\nGET ' + getUrl + (expand ? '?$expand=' + expand : '') + ' HTTP/1.1\r\n';
          } else {
            let query = new Builder(store, modelName);
            query = isArray(projection) ? query.select(projection.join(',')) : query.selectByProjection(projection);
            query = query.build();
            const queryAdapter = new ODataQueryAdapter(getUrl, store);
            const fullUrl = queryAdapter.getODataFullUrl(query);

            getQuery += '\r\nGET ' + fullUrl + ' HTTP/1.1\r\n';
          }

          getQuery += 'Content-Type: application/json;type=entry\r\n';
          getQuery += 'Prefer: return=representation\r\n';
          getQueries.push(getQuery);
        }
      });

      requestBody += '--' + changeSetBoundary + '--' + '\r\n\r\n';
      requestBody += getQueries.join('\r\n');
      requestBody += '\r\n\r\n--' + boundary + '--';

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
        try {
          const meta = getResponseMeta(xhr.getResponseHeader('Content-Type'));
          if (meta.contentType !== 'multipart/mixed') {
            return reject(new DS.AdapterError('Invalid response type.'));
          }

          let batchResponses = getBatchResponses(response, meta.boundary).map(parseBatchResponse);


          let getResponses = batchResponses.filter(r => r.contentType === 'application/http');
          const updateResponse = batchResponses.find(r => r.contentType === 'multipart/mixed');

          const errorsChangesets = updateResponse.changesets.filter(c => !this.isSuccess(c.meta.status));
          if (errorsChangesets.length) {
            return reject(errorsChangesets.map(c => new DS.AdapterError(c.body)));
          }

          const errors = [];
          const result = [];
          getResponses = this._normalizeBatchGetResponses(store, getResponses);
          if (errors.length) {
            return reject(errors);
          }

          const normalizedForPush = A();

          models.forEach((model) => {
            const modelDirtyType = model.get('dirtyType');
            if (modelDirtyType === 'deleted') {
              run(store, store.unloadRecord, model);
            } else if (modelDirtyType === 'created' || modelDirtyType === 'updated' || model.hasChangedBelongsTo()) {
              run(() => {
                const id = model.get('id');
                const normalized = getResponses[id];
                if (!isNone(normalized)) {
                  normalizedForPush.addObject(normalized);
                  const internalModel = model._internalModel;
                  internalModel.adapterWillCommit();
                  internalModel.flushChangedAttributes();               
                  store.didSaveRecord(internalModel, normalized);
                } else {
                  return reject(new Error(`Can't find model with id ${id} in batch response.`));
                }
              });
            }

            result.push(modelDirtyType === 'deleted' ? null : model);
          });

          run(() => {
            normalizedForPush.forEach((record) => {
              store.push(record);
            });
          });

          return resolve(result);
        } catch (error) {
          // If an error is thrown then this situation is not processed and user will get not understandable result.
          return reject(new DS.AdapterError(error));
        }
      }).fail(reject));
    });
  },

  /**
    A method to get array of models with batch request.

    @method batchSelect
    @param {DS.Store} store The store.
    @param {Array} queries Array of Flexberry Query objects.
    @return {Promise} A promise that fulfilled with an array of query responses.
  */
  batchSelect(store, queries) {
    const boundary = `batch_${generateUniqueId()}`;
    let requestBody = '';
    queries.forEach(query => {
      requestBody += `--${boundary}\r\n`;
      requestBody += 'Content-Type: application/http\r\n';
      requestBody += 'Content-Transfer-Encoding: binary\r\n';

      const getUrl = this._buildURL(query.modelName);

      const queryAdapter = new ODataQueryAdapter(getUrl, store);
      const fullUrl = queryAdapter.getODataFullUrl(query);

      requestBody += '\r\nGET ' + fullUrl + ' HTTP/1.1\r\n';
      requestBody += 'Content-Type: application/json;type=entry\r\n';
      requestBody += 'Prefer: return=representation\r\n\r\n';
    });

    const url = `${this._buildURL()}/$batch`;

    const headers = $.extend({}, this.get('headers'));
    headers['Content-Type'] = `multipart/mixed;boundary=${boundary}`;
    const httpMethod = 'POST';

    const options = {
      method: httpMethod,
      headers,
      dataType: 'text',
      data: requestBody
    };

    return new Promise((resolve, reject) => $.ajax(url, options).done((response, statusText, xhr) => {
      const meta = getResponseMeta(xhr.getResponseHeader('Content-Type'));
      if (meta.contentType !== 'multipart/mixed') {
        return reject(new DS.AdapterError('Invalid response type.'));
      }

      const batchResponses = getBatchResponses(response, meta.boundary).map(parseBatchResponse);
      const getResponses = batchResponses.filter(r => r.contentType === 'application/http');

      const errorsChangesets = getResponses.filter(c => !this.isSuccess(c.response.meta.status));
      if (errorsChangesets.length) {
        return reject(errorsChangesets.map(c => new DS.AdapterError(c.body)));
      }

      const result = A();

      getResponses.forEach(({response}) => {
        const context = response.body['@odata.context'];
        const type = this.getModelNameFromOdataContext(context);
        const requestResult = { data: A(), included: A(), meta: store.serializerFor(type).extractMeta(store, type, response.body) };
        const records = response.body.value;
        records.forEach(record => {
          const normalized = store.normalize(type, record);

          // eslint-disable-next-line ember/jquery-ember-run
          requestResult.data.addObject(normalized.data);
          if (normalized.included) {
            requestResult.included.addObjects(normalized.included);
          }
        });

        result.addObject(requestResult);
      });

      return resolve(result);
    }).fail(reject));
  },

  /**
    A method to get model name from odata context.

    @method getModelNameFromOdataContext
    @param {String} context OData context from get response.
    @return {String} Model name.
  */
  getModelNameFromOdataContext(context) {
    const regex = /(?<=\$metadata#)\w*(?=[\(\/])/g;

    return odataSingularize(dasherize(regex.exec(context)[0]));
  },

  /**
    A method to normalize batch get responses.

    @method _normalizeBatchGetResponses
    @param {DS.Store} store
    @param {Array} getResponses Responses array.
    @param {Array} errors Errors array.
    @return {Object} Normalized responses by record id.
    @private
  */
  _normalizeBatchGetResponses(store, getResponses, errors) {
    const result = {};
    if (!isArray(getResponses)) {
      return result;
    }

    getResponses.forEach(({ response }) => {
      if (this.isSuccess(response.meta.status)) {
        const context = response.body['@odata.context'];
        const modelName = this.getModelNameFromOdataContext(context);
        const normalized = store.normalize(modelName, response.body);
        const normId = get(normalized, 'data.id');
        set(result, normId, normalized);
      } else {
        errors.push(new DS.AdapterError(response.body));
      }
    });

    return result;
  },

  /**
    A method to generate url part from queryParams.

    @method _generateFunctionQueryString
    @param {Object} queryParams
    @param {DS.Store} store
    @return {String}
    @private
  */
  _generateFunctionQueryString(queryParams, store) {
    const adapter = new ODataQueryAdapter('1', store);
    let queryUrlString = '';

    if (queryParams.expand || queryParams.select) {
      queryUrlString = adapter.getODataFunctionQuery(queryParams);
    }

    return queryUrlString;
  },

  /**
    A method to make args object function/action call method's.

    @method _getODataArgs
    @param {Object} params
    @param {Boolean} isEmber
    @param {Boolean} isAction
    @return {Object}
    @private
  */
  _getODataArgs(params, isEmber, isAction) {
    const paramsLastIndex = isEmber ? 8 : 6;
    let args = {};
    args[isAction ? 'actionName' : 'functionName'] = params[0];
    args[isAction ? 'data' : 'params'] = params[1];
    args.url = params[2];
    args.fields = params[3];
    if (isEmber) {
      args.store = params[4];
      args.modelName = params[5];
    }

    args.successCallback = params[paramsLastIndex - 2];
    args.failCallback = params[paramsLastIndex - 1];
    args.alwaysCallback = params[paramsLastIndex];

    return args;
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

    return new Promise(function (resolve, reject) {
      $.ajax(params).done((msg) => {
        if (!isNone(store) && !isNone(modelname)) {
          const normalizedRecords = { data: A(), included: A() };
          Object.values(msg.value).forEach(record => {
            const normalized = store.normalize(modelname, record);
            normalizedRecords.data.addObject(normalized.data);
            if (normalized.included) {
              normalizedRecords.included.addObjects(normalized.included);
            }
          });
          run.join(() => { msg = store.push(normalizedRecords); });
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
    let url = [];
    let host = get(this, 'host');
    let prefix = this.urlPrefix();
    let path;

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
