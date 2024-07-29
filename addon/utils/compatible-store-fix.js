import { CacheHandler } from '@ember-data/store';
import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import {
  adapterFor,
  LegacyNetworkHandler,
  normalize,
  pushPayload,
  serializeRecord,
  serializerFor,
} from '@ember-data/legacy-compat';
import JSONAPICache from '@ember-data/json-api';
import {
  buildSchema,
  instantiateRecord as instantiateRecordData,
  modelFor as modelForData,
  teardownRecord as teardownRecordData
} from '@ember-data/model/hooks';

export default function fixLegacyStore(store) {
  store.adapterFor ??= adapterFor;
  store.serializerFor ??= serializerFor;
  store.pushPayload ??= pushPayload;
  store.normalize ??= normalize;
  store.serializeRecord ??= serializeRecord;
  store.createSchemaService ??= createSchemaService;
  store.createCache ??= createCache;
  store.instantiateRecord = instantiateRecord;
  store.teardownRecord = teardownRecord;
  store.modelFor = modelFor;
  if (!store.requestManager) {
    store.requestManager = new RequestManager();
    store.requestManager.use([LegacyNetworkHandler, Fetch]);
  }

  store.requestManager.useCache(CacheHandler);
}

function createSchemaService() {
  return buildSchema(this);
}

function createCache(storeWrapper) {
  return new JSONAPICache(storeWrapper);
}

function instantiateRecord(identifier, createRecordArgs) {
  return instantiateRecordData.call(this, identifier, createRecordArgs);
}

function teardownRecord(record) {
  teardownRecordData.call(this, record);
}

function modelFor(type) {
  return modelForData.call(this, type);
}