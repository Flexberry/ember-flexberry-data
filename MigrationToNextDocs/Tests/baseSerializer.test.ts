import { describe, it, expect, beforeEach } from 'vitest';

class BaseSerializer {
  private metaPropertiesPrefix: string;
  private isNewSerializerAPI: boolean;

  constructor() {
    this.metaPropertiesPrefix = '@odata.';
    this.isNewSerializerAPI = true;
  }

  modelNameFromPayloadKey(key: string): string {
    if (key.startsWith('#.')) {
      return this._odataDasherize(key.replace(/[#\.]/g, ''));
    }
    return this._odataSingularize(this._odataDasherize(key.replace(/[#\.]/g, '')));
  }

  keyForAttribute(attr: string): string {
    return this._capitalize(attr);
  }

  keyForRelationship(key: string, relationship: any): string {
    return this._capitalize(key) + '@odata.bind';
  }

  modelNameFromRelationshipType(relationshipType: string): string {
    return this._capitalize(this._camelize(relationshipType));
  }

  serializeIntoHash(hash: any, type: any, record: any, options?: any): any {
    options = options || {};
    options.includeId = true;
    return { ...hash, ...this.serialize(record, options) };
  }

  extractMeta(store: any, type: any, payload: any): any {
    if (!payload) {
      return undefined;
    }

    const meta: any = {};
    this._moveMeta(meta, payload, false);
    return meta;
  }

  normalizeSingleResponse(store: any, typeClass: any, payload: any, id: string): any {
    payload = {
      [typeClass.modelName]: payload
    };
    this._moveMeta(payload, payload[typeClass.modelName], true);
    return payload;
  }

  normalizeArrayResponse(store: any, typeClass: any, payload: any): any {
    const rootKey = this._odataPluralize(typeClass.modelName);
    payload[rootKey] = payload.value;
    delete payload.value;
    return payload;
  }

  normalize(typeClass: any, hash: any): any {
    const odataType = this.getMetaPropertiesPrefix() + 'type';

    if (hash.hasOwnProperty(odataType)) {
      const hashModel = this.modelNameFromPayloadKey(hash[odataType]);
      if (hashModel !== typeClass.modelName) {
        return { hashModel };
      }
    }
    return hash;
  }

  serializePolymorphicType(snapshot: any, json: any, relationship: any): void {
    const belongsTo = snapshot.belongsTo(relationship.key);
    if (belongsTo) {
      const payloadKey = this.keyForRelationship(relationship.key, relationship.kind, 'serialize');
      json[payloadKey] = this._odataPluralize(this.modelNameFromRelationshipType(belongsTo.modelName)) + '(' + belongsTo.id + ')';
    }
  }

  extractPolymorphicRelationship(relationshipType: string, relationshipHash: any): any {
    const odataType = this.getMetaPropertiesPrefix() + 'type';
    if (relationshipHash.hasOwnProperty(odataType)) {
      relationshipHash.type = this.modelNameFromPayloadKey(relationshipHash[odataType]);
    } else {
      relationshipHash.type = relationshipType;
    }
    return relationshipHash;
  }

  getMetaPropertiesPrefix(): string {
    return this.metaPropertiesPrefix;
  }

  private _capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private _camelize(str: string): string {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  private _odataDasherize(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private _odataPluralize(str: string): string {
    if (str.endsWith('s')) {
      return str + 'es';
    }
    return str + 's';
  }

  private _odataSingularize(str: string): string {
    if (str.endsWith('es')) {
      return str.slice(0, -2);
    }
    if (str.endsWith('s')) {
      return str.slice(0, -1);
    }
    return str;
  }

  private _moveMeta(dest: any, src: any, withPrefix: boolean): void {
    const prefix = this.metaPropertiesPrefix;
    const prefixLength = prefix.length;

    for (const srcKey in src) {
      if (src.hasOwnProperty(srcKey) && srcKey.indexOf(prefix) === 0) {
        const destKey = withPrefix ? srcKey : srcKey.substring(prefixLength);
        dest[destKey] = src[srcKey];
        delete src[srcKey];
      }
    }
  }
}

describe('baseSerializer', () => {
  let serializer: BaseSerializer;

  beforeEach(() => {
    serializer = new BaseSerializer();
  });

  it('should initialize with default settings', () => {
    expect(serializer).toBeDefined();
    expect(serializer.getMetaPropertiesPrefix()).toBe('@odata.');
  });

  it('should convert payload key to model name', () => {
    const modelName = serializer.modelNameFromPayloadKey('MyModel');
    expect(modelName).toBe('my-model');
  });

  it('should handle model name with hash prefix', () => {
    const modelName = serializer.modelNameFromPayloadKey('#.MyModel');
    expect(modelName).toBe('my-model');
  });

  it('should convert attribute to key', () => {
    const key = serializer.keyForAttribute('myAttribute');
    expect(key).toBe('MyAttribute');
  });

  it('should convert relationship to key', () => {
    const key = serializer.keyForRelationship('myRelationship', {});
    expect(key).toBe('MyRelationship@odata.bind');
  });

  it('should convert relationship type to model name', () => {
    const modelName = serializer.modelNameFromRelationshipType('my-relationship-type');
    expect(modelName).toBe('MyRelationshipType');
  });

  it('should serialize into hash', () => {
    const hash = { id: '1' };
    const record = { id: '1', name: 'Test' };
    const result = serializer.serializeIntoHash(hash, {}, record);

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test');
  });

  it('should extract metadata from payload', () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const payload = {
      '@odata.count': 10,
      value: [],
    };

    const meta = serializer.extractMeta(store, type, payload);
    expect(meta).toBeDefined();
    expect(meta['odata.count']).toBe(10);
  });

  it('should return undefined metadata for null payload', () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const meta = serializer.extractMeta(store, type, null);
    expect(meta).toBeUndefined();
  });

  it('should normalize single response', () => {
    const store = {} as any;
    const typeClass = { modelName: 'test-model' };
    const payload = { id: '1', name: 'Test' };
    const id = '1';

    const result = serializer.normalizeSingleResponse(store, typeClass, payload, id);

    expect(result).toBeDefined();
    expect(result['test-model']).toBeDefined();
    expect(result['test-model'].id).toBe('1');
  });

  it('should normalize array response', () => {
    const store = {} as any;
    const typeClass = { modelName: 'test-model' };
    const payload = { value: [{ id: '1' }, { id: '2' }] };

    const result = serializer.normalizeArrayResponse(store, typeClass, payload);

    expect(result).toBeDefined();
    expect(result['test-models']).toBeDefined();
    expect(result['test-models'].length).toBe(2);
  });

  it('should normalize with odata type', () => {
    const typeClass = { modelName: 'expected-model' };
    const hash = {
      '@odata.type': 'MyModel',
      id: '1',
    };

    const result = serializer.normalize(typeClass, hash);
    expect(result.hashModel).toBe('my-model');
  });

  it('should serialize polymorphic type', () => {
    const snapshot = {
      belongsTo: vi.fn().mockReturnValue({ modelName: 'related-model', id: '123' }),
    };
    const json: any = {};
    const relationship = { key: 'related', kind: 'belongsTo' };

    serializer.serializePolymorphicType(snapshot, json, relationship);

    expect(json['Related@odata.bind']).toBe('RelatedModels(123)');
  });

  it('should extract polymorphic relationship', () => {
    const relationshipType = 'related';
    const relationshipHash = {
      '@odata.type': 'MyModel',
    };

    const result = serializer.extractPolymorphicRelationship(relationshipType, relationshipHash);
    expect(result.type).toBe('my-model');
  });

  it('should extract polymorphic relationship with default type', () => {
    const relationshipType = 'related';
    const relationshipHash = {};

    const result = serializer.extractPolymorphicRelationship(relationshipType, relationshipHash);
    expect(result.type).toBe('related');
  });

  it('should normalize multiple payload keys', () => {
    expect(serializer.modelNameFromPayloadKey('User')).toBe('user');
    expect(serializer.modelNameFromPayloadKey('UserGroup')).toBe('user-group');
    expect(serializer.modelNameFromPayloadKey('MyAwesomeModel')).toBe('my-awesome-model');
  });

  it('should pluralize model names', () => {
    expect(serializer['_odataPluralize']('user')).toBe('users');
    expect(serializer['_odataPluralize']('category')).toBe('categorys');
    expect(serializer['_odataPluralize']('bus')).toBe('buses');
  });
});
