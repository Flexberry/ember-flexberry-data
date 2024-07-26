import Store from '@ember-data/store';
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
import { buildSchema, instantiateRecord, modelFor, teardownRecord } from '@ember-data/model/hooks';

export default class extends Store {
  fixLegacyStore(store) {
    store.adapterFor ??= adapterFor;
    store.serializerFor ??= serializerFor;
    store.pushPayload ??= pushPayload;
    store.normalize ??= normalize;
    store.serializeRecord ??= serializeRecord;
    store.createSchemaService ??= this.createSchemaService;
    store.createCache ??= this.createCache;
    store.instantiateRecord = this.instantiateRecord;
    store.teardownRecord = this.teardownRecord;
    store.modelFor = this.modelFor;
    if (!store.requestManager) {
      store.requestManager = new RequestManager();
      store.requestManager.use([LegacyNetworkHandler, Fetch]);
    }

    store.requestManager.useCache(CacheHandler);
  }

  createSchemaService() {
    return buildSchema(this);
  }

  createCache(storeWrapper) {
    return new JSONAPICache(storeWrapper);
  }

  instantiateRecord(identifier, createRecordArgs) {
    return instantiateRecord.call(this, identifier, createRecordArgs);
  }

  teardownRecord(record) {
    teardownRecord.call(this, record);
  }

  modelFor(type) {
    return (modelFor.call(this, type)) || super.modelFor(type);
  }
}