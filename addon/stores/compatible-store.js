/*import Store from '@ember-data/store';
import { CacheHandler } from '@ember-data/store';
import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import {
  adapterFor,
  cleanup,
  LegacyNetworkHandler,
  normalize,
  pushPayload,
  serializeRecord,
  serializerFor,
} from '@ember-data/legacy-compat';
import JSONAPICache from '@ember-data/json-api';
import { buildSchema, instantiateRecord, modelFor, teardownRecord } from '@ember-data/model/hooks';

export default class extends Store {
  adapterFor = adapterFor;
  serializerFor = serializerFor;
  pushPayload = pushPayload;
  normalize = normalize;
  serializeRecord = serializeRecord;

  constructor() {
    super(...arguments);

    if (!this.requestManager) {
      this.requestManager = new RequestManager();
      this.requestManager.use([LegacyNetworkHandler, Fetch]);
    }

    this.requestManager.useCache(CacheHandler);
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

  destroy() {
    cleanup.call(this);
    super.destroy();
  }
}*/