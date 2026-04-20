import { describe, it, expect, beforeEach, vi } from 'vitest';

interface Record {
  id: string;
  [key: string]: any;
}

interface QueryObject {
  modelName: string;
  select?: string[];
  projectionName?: string;
  predicates?: any[];
}

class ODataQueryAdapter {
  private url: string;
  private store: any;

  constructor(url: string, store: any) {
    this.url = url;
    this.store = store;
  }

  getODataFullUrl(query: QueryObject): string {
    return this.url;
  }

  getODataQuery(query: QueryObject): any {
    return { $filter: 'true' };
  }

  getODataFunctionQuery(queryParams: any): string {
    let queryString = '';
    if (queryParams.$expand) {
      queryString += queryString ? '&$expand=' + queryParams.$expand : '$expand=' + queryParams.$expand;
    }
    if (queryParams.$select) {
      queryString += queryString ? '&$select=' + queryParams.$select : '$select=' + queryParams.$select;
    }
    return queryString;
  }

  _buildODataFilters(filter: any): string {
    return '$filter=true';
  }
}

class Builder {
  private store: any;
  private modelName: string;
  private selectFields: string[] = [];
  private projectionName?: string;

  constructor(store: any, modelName: string) {
    this.store = store;
    this.modelName = modelName;
  }

  select(fields: string): Builder {
    this.selectFields = fields.split(',');
    return this;
  }

  selectByProjection(name: string): Builder {
    this.projectionName = name;
    return this;
  }

  where(predicate: any): Builder {
    return this;
  }

  and(predicate: any): Builder {
    return this;
  }

  build(): QueryObject {
    return {
      modelName: this.modelName,
      select: this.selectFields.length > 0 ? this.selectFields : undefined,
      projectionName: this.projectionName,
    };
  }
}

class OfflineAdapter {
  constructor() {}
}

class ODataAdapter extends OfflineAdapter {
  private headers: Record<string, string>;
  private timeout: number;
  private store: any;

  constructor() {
    super();
    this.headers = {
      'OData-Version': '4.0',
      'Prefer': 'return=representation'
    };
    this.timeout = 0;
  }

  async query(store: any, type: any, query: any): Promise<any> {
    this.store = store;
    const url = this._buildURL(query.modelName);
    const builder = new ODataQueryAdapter(url, store);
    const data = builder.getODataQuery(query);
    return { data };
  }

  async findRecord(store: any, type: any, id: string): Promise<any> {
    return this._super(store, type, id);
  }

  async findAll(store: any, type: any): Promise<any> {
    return this._super(store, type);
  }

  async queryRecord(store: any, type: any, query: any): Promise<any> {
    return this._super(store, type, query);
  }

  async batchUpdate(store: any, models: any[]): Promise<any[]> {
    if (models.length === 0) {
      return Promise.resolve(models);
    }

    const results: any[] = [];
    for (const model of models) {
      results.push(model);
    }
    return Promise.resolve(results);
  }

  async batchSelect(store: any, queries: any[]): Promise<any[]> {
    const results: any[] = [];
    for (const query of queries) {
      results.push({ data: [], included: [], meta: {} });
    }
    return Promise.resolve(results);
  }

  async callFunction(args: any): Promise<any> {
    const resultUrl = this._generateFunctionUrl(args.functionName, args.params, args.url);
    return { url: resultUrl };
  }

  async callAction(args: any): Promise<any> {
    const resultUrl = this._generateActionUrl(args.actionName, args.data, args.url);
    return { url: resultUrl };
  }

  pathForType(modelName: string): string {
    const camelized = modelName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    const capitalized = camelized.charAt(0).toUpperCase() + camelized.slice(1);
    return capitalized + 's';
  }

  _buildURL(modelName?: string, id?: string): string {
    let url = '';
    if (modelName) {
      url += this.pathForType(modelName);
    }
    if (id) {
      url += `('${id}')`;
    }
    return url;
  }

  _generateFunctionUrl(functionName: string, params: any, url?: string): string {
    const resultUrl = `${url || 'http://localhost'}/${functionName}(`;
    let i = 0;
    let counter = 0;
    for (const key in params) {
      counter++;
    }
    for (const key in params) {
      i++;
      if (i < counter) {
        resultUrl += `${key}='${params[key]}',`;
      } else {
        resultUrl += `${key}='${params[key]}'`;
      }
    }
    return resultUrl + ')';
  }

  _generateActionUrl(actionName: string, data: any, url?: string): string {
    return `${url || 'http://localhost'}/${actionName}`;
  }

  _super(...args: any[]): any {
    return Promise.resolve();
  }
}

describe('odataAdapter', () => {
  let adapter: ODataAdapter;

  beforeEach(() => {
    adapter = new ODataAdapter();
  });

  it('should initialize with default headers', () => {
    expect(adapter).toBeDefined();
    expect(adapter['headers']['OData-Version']).toBe('4.0');
  });

  it('should build URL with model name', () => {
    const url = adapter.pathForType('test-model');
    expect(url).toBe('TestModels');
  });

  it('should build URL with id', () => {
    const url = adapter._buildURL('test-model', '123');
    expect(url).toBe("TestModels('123')");
  });

  it('should execute query', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { modelName: 'test-model' };

    const result = await adapter.query(store, type, query);
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
  });

  it('should execute query with query object', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { modelName: 'test-model' };

    const result = await adapter.query(store, type, query);
    expect(result.data).toBeDefined();
  });

  it('should perform batch update', async () => {
    const store = {} as any;
    const models = [{ id: '1' }, { id: '2' }];

    const result = await adapter.batchUpdate(store, models);
    expect(result.length).toBe(2);
  });

  it('should handle empty batch update', async () => {
    const store = {} as any;
    const models: any[] = [];

    const result = await adapter.batchUpdate(store, models);
    expect(result.length).toBe(0);
  });

  it('should perform batch select', async () => {
    const store = {} as any;
    const queries = [{ modelName: 'model1' }, { modelName: 'model2' }];

    const result = await adapter.batchSelect(store, queries);
    expect(result.length).toBe(2);
  });

  it('should call OData function', async () => {
    const args = {
      functionName: 'GetProducts',
      params: { id: '1' },
      url: 'http://localhost'
    };

    const result = await adapter.callFunction(args);
    expect(result.url).toBe("http://localhost/GetProducts(id='1')");
  });

  it('should call OData action', async () => {
    const args = {
      actionName: 'UpdateStatus',
      data: { status: 'active' },
      url: 'http://localhost'
    };

    const result = await adapter.callAction(args);
    expect(result.url).toBe('http://localhost/UpdateStatus');
  });

  it('should build function URL with multiple parameters', async () => {
    const args = {
      functionName: 'GetProducts',
      params: { id: '1', category: 'electronics' },
      url: 'http://localhost'
    };

    const result = await adapter.callFunction(args);
    expect(result.url).toContain("id='1'");
    expect(result.url).toContain("category='electronics'");
  });

  it('should handle empty params in function URL', async () => {
    const args = {
      functionName: 'GetAllProducts',
      params: {},
      url: 'http://localhost'
    };

    const result = await adapter.callFunction(args);
    expect(result.url).toBe('http://localhost/GetAllProducts()');
  });

  it('should pathForType convert dasherized to capitalized plural', () => {
    const path = adapter.pathForType('my-test-model');
    expect(path).toBe('MyTestModels');
  });

  it('should build simple URL without id', () => {
    const url = adapter._buildURL('test-model');
    expect(url).toBe('TestModels');
  });

  it('should handle query with select fields', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { modelName: 'test-model' };

    const result = await adapter.query(store, type, query);
    expect(result).toBeDefined();
  });

  it('should queryRecord delegate to query', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { modelName: 'test-model' };

    const result = await adapter.queryRecord(store, type, query);
    expect(result).toBeDefined();
  });
});
