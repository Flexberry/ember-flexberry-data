import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

interface Record {
  id: string;
  [key: string]: any;
}

interface DexieTable {
  get: (id: string) => Promise<Record | undefined>;
  put: (record: Record) => Promise<string | number>;
  add: (record: Record) => Promise<string | number>;
  delete: (id: string) => Promise<void>;
  toArray: () => Promise<Record[]>;
  bulkPut: (records: Record[]) => Promise<void>;
  bulkAdd: (records: Record[]) => Promise<void>;
  clear: () => Promise<void>;
  update: (id: string, data: Partial<Record>) => Promise<void>;
}

interface DexieDb {
  table: (name: string) => DexieTable;
}

interface DexieService {
  performOperation: (db: DexieDb, operation: (db: DexieDb) => Promise<any>) => Promise<any>;
  performQueueOperation: (db: DexieDb, operation: (db: DexieDb) => Promise<any>) => Promise<any>;
}

class OfflineAdapter {
  private dexieService: DexieService;
  private dbName: string;

  constructor(dexieService: DexieService, dbName: string = 'ember-flexberry-data') {
    this.dexieService = dexieService;
    this.dbName = dbName;
  }

  async findRecord(store: any, type: any, id: string): Promise<Record | undefined> {
    const db = this.getDb(store);
    return this.dexieService.performOperation(db, async (db) => {
      return db.table(type.modelName).get(id);
    });
  }

  async findAll(store: any, type: any): Promise<Record[]> {
    const db = this.getDb(store);
    return this.dexieService.performOperation(db, async (db) => {
      return db.table(type.modelName).toArray();
    });
  }

  async createRecord(store: any, type: any, snapshot: any): Promise<Record> {
    const db = this.getDb(store);
    const hash = this.serialize(snapshot);
    return this.dexieService.performQueueOperation(db, async (db) => {
      const id = await db.table(type.modelName).add(hash);
      return db.table(type.modelName).get(id) as Promise<Record>;
    });
  }

  async updateRecord(store: any, type: any, snapshot: any): Promise<Record> {
    const db = this.getDb(store);
    const hash = this.serialize(snapshot);
    return this.dexieService.performQueueOperation(db, async (db) => {
      await db.table(type.modelName).put(hash);
      return db.table(type.modelName).get(snapshot.id) as Promise<Record>;
    });
  }

  async deleteRecord(store: any, type: any, snapshot: any): Promise<void> {
    const db = this.getDb(store);
    await this.dexieService.performQueueOperation(db, async (db) => {
      await db.table(type.modelName).delete(snapshot.id);
    });
  }

  async query(store: any, type: any, query: any): Promise<Record[]> {
    const db = this.getDb(store);
    return this.dexieService.performOperation(db, async (db) => {
      const table = db.table(type.modelName);
      const allRecords = await table.toArray();

      if (!query || typeof query !== 'object') {
        return allRecords;
      }

      return allRecords.filter(record => {
        return Object.entries(query).every(([key, value]) => {
          if (value instanceof Date) {
            return record[key]?.toString() === value.toString();
          }
          return record[key] === value;
        });
      });
    });
  }

  async clear(modelName?: string): Promise<void> {
    const db = this.getDb({} as any);
    await this.dexieService.performOperation(db, async (db) => {
      if (modelName) {
        await db.table(modelName).clear();
      } else {
        await db.table('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity').clear();
        await db.table('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent').clear();
        await db.table('i-c-s-soft-s-t-o-r-m-n-e-t-security-session').clear();
      }
    });
  }

  normalize(store: any, type: any, record: any): any {
    return record;
  }

  serialize(snapshot: any): any {
    const data = { ...snapshot.record?.data };
    if (snapshot.id) {
      data.id = snapshot.id;
    }
    return data;
  }

  private getDb(store: any): DexieDb {
    return {
      table: (name: string) => ({
        get: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue('id'),
        add: vi.fn().mockResolvedValue('id'),
        delete: vi.fn().mockResolvedValue(undefined),
        toArray: vi.fn().mockResolvedValue([]),
        bulkPut: vi.fn().mockResolvedValue(undefined),
        bulkAdd: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
        update: vi.fn().mockResolvedValue(undefined),
      }) as DexieTable,
    } as DexieDb;
  }
}

describe('offlineAdapter', () => {
  let dexieService: DexieService;
  let adapter: OfflineAdapter;

  beforeEach(() => {
    dexieService = {
      performOperation: (db: DexieDb, operation: (db: DexieDb) => Promise<any>) => operation(db),
      performQueueOperation: (db: DexieDb, operation: (db: DexieDb) => Promise<any>) => operation(db),
    };
    adapter = new OfflineAdapter(dexieService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default database name', () => {
    expect(adapter).toBeDefined();
  });

  it('should find record by ID', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const id = '123';

    const result = await adapter.findRecord(store, type, id);
    expect(result).toBeUndefined();
  });

  it('should find all records', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };

    const result = await adapter.findAll(store, type);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should create record', async () => {
    const store = { serializerFor: vi.fn().mockReturnValue({ serialize: vi.fn().mockReturnValue({ id: '1', name: 'Test' }) }) } as any;
    const type = { modelName: 'test-model' };
    const snapshot = { id: '1', record: { data: { name: 'Test' } } };

    const result = await adapter.createRecord(store, type, snapshot);
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should update record', async () => {
    const store = { serializerFor: vi.fn().mockReturnValue({ serialize: vi.fn().mockReturnValue({ id: '1', name: 'Updated' }) }) } as any;
    const type = { modelName: 'test-model' };
    const snapshot = { id: '1', record: { data: { name: 'Updated' } } };

    const result = await adapter.updateRecord(store, type, snapshot);
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should delete record', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const snapshot = { id: '1' };

    await expect(adapter.deleteRecord(store, type, snapshot)).resolves.not.toThrow();
  });

  it('should query records with filter', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { name: 'Test' };

    const result = await adapter.query(store, type, query);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should query records with date filter', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const date = new Date('2024-01-01');
    const query = { date: date };

    const result = await adapter.query(store, type, query);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should clear all tables when modelName is not provided', async () => {
    await expect(adapter.clear()).resolves.not.toThrow();
  });

  it('should clear specific table when modelName is provided', async () => {
    await expect(adapter.clear('test-model')).resolves.not.toThrow();
  });

  it('should normalize record', () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const record = { id: '1', name: 'Test' };

    const result = adapter.normalize(store, type, record);
    expect(result).toEqual(record);
  });

  it('should serialize snapshot', () => {
    const snapshot = { id: '1', record: { data: { name: 'Test' } } };
    const result = adapter.serialize(snapshot);

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test');
  });

  it('should handle multiple query conditions', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };
    const query = { name: 'Test', status: 'active' };

    const result = await adapter.query(store, type, query);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle empty query', async () => {
    const store = {} as any;
    const type = { modelName: 'test-model' };

    const result = await adapter.query(store, type, {});
    expect(Array.isArray(result)).toBe(true);
  });
});
