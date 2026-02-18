import { LocalStore } from '../stores/local-store';
import { SyncerService } from '../services/syncer';
import { QueryObject } from '../query/query-object';
import { SimplePredicate, StringPredicate, ComplexPredicate } from '../query/predicate';

describe('LocalStore predicate filtering', () => {
  let store: LocalStore;

  beforeAll(() => {
    // Используем имя БД, уникальное для тестов.
    // В среде node IndexedDB, как правило, недоступен, поэтому эти тесты
    // предназначены для запуска в браузерной среде (например, через jsdom)
    // или могут быть замоканы на уровне OfflineAdapter.
    store = new LocalStore('test-db');
  });

  test('filters by SimplePredicate eq', () => {
    const data = [
      { id: '1', name: 'One', price: 10 },
      { id: '2', name: 'Two', price: 20 },
    ];

    const query = new QueryObject('Product')
      .setPredicate(new SimplePredicate('price', 'eq', 20));

    // @ts-expect-error доступ к приватному методу только в тестах
    const result = (store as any).applyPredicateFilter(data, query.predicate);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by StringPredicate contains (case-insensitive)', () => {
    const data = [
      { id: '1', name: 'Apple' },
      { id: '2', name: 'banana' },
      { id: '3', name: 'Cherry' },
    ];

    const predicate = new StringPredicate('name').contains('AN');

    // @ts-expect-error доступ к приватному методу только в тестах
    const result = (store as any).applyPredicateFilter(data, predicate);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by ComplexPredicate AND', () => {
    const data = [
      { id: '1', name: 'Apple', price: 10 },
      { id: '2', name: 'banana', price: 20 },
      { id: '3', name: 'Another apple', price: 30 },
    ];

    const p1 = new StringPredicate('name').contains('apple');
    const p2 = new SimplePredicate('price', 'gt', 10);
    const complex = new ComplexPredicate('AND', p1, p2);

    // @ts-expect-error доступ к приватному методу только в тестах
    const result = (store as any).applyPredicateFilter(data, complex);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});

describe('SyncerService basic behaviour (with fake stores)', () => {
  class FakeStore {
    public created: any[] = [];
    public updated: any[] = [];
    public allRecords: any[] = [];

    async findRecords(): Promise<any[]> {
      return this.allRecords;
    }

    async findAllRecords(): Promise<any[]> {
      return this.allRecords;
    }

    async createRecord(modelName: string, data: any): Promise<any> {
      const record = { ...data, id: data.id ?? String(this.created.length + 1) };
      this.created.push({ modelName, record });
      return record;
    }

    async updateRecord(modelName: string, id: string, data: any): Promise<any> {
      const record = { ...data, id };
      this.updated.push({ modelName, record });
      return record;
    }
  }

  test('syncToOffline copies data from online to offline and writes audit log', async () => {
    const online = new FakeStore();
    const offline = new FakeStore();

    online.allRecords = [
      { id: '1', name: 'Item1' },
      { id: '2', name: 'Item2' },
    ];

    const syncer = new SyncerService(online as any, offline as any);
    const query = new QueryObject('TestModel');

    await syncer.syncToOffline('TestModel', query, { clearBefore: false });

    expect(offline.created).toHaveLength(2);

    const log = syncer.getAuditLog();
    expect(log.length).toBeGreaterThan(0);
    expect(log.every((e) => e.modelName === 'TestModel')).toBe(true);
  });

  test('syncToOnline sends offline data to online and fills audit log', async () => {
    const online = new FakeStore();
    const offline = new FakeStore();

    offline.allRecords = [
      { id: '1', name: 'Item1' },
      { name: 'New item without id' },
    ];

    const syncer = new SyncerService(online as any, offline as any);

    await syncer.syncToOnline('TestModel');

    expect(online.updated).toHaveLength(1);
    expect(online.created).toHaveLength(1);

    const log = syncer.getAuditLog();
    expect(log.length).toBeGreaterThanOrEqual(2);
  });
});

