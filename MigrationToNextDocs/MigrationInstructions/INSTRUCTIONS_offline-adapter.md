# Модуль: offline-adapter

## Файлы
- addon/adapters/offline.js
- app/adapters/offline.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый adapter)

## Рекомендации по переносу

### Adapter → API Client Class

**Ember:** `DS.Adapter` → **Next.js:** `src/adapters/offlineAdapter.ts`

**Пример шаблона:**
```ts
// adapters/offlineAdapter.ts
import { DexieService } from '../services/dexie';

export class OfflineAdapter {
  private dexieService: DexieService;
  private modelName: string;

  constructor(dexieService: DexieService, modelName: string) {
    this.dexieService = dexieService;
    this.modelName = modelName;
  }

  // Find record by ID
  async findRecord(store: any, type: any, id: string): Promise<any> {
    const db = this.dexieService.dexie(this.modelName);
    const record = await db.table(this.modelName).get(id);
    return this.normalize(store, type, record);
  }

  // Find all records
  async findAll(store: any, type: any): Promise<any[]> {
    const db = this.dexieService.dexie(this.modelName);
    const records = await db.table(this.modelName).toArray();
    return records.map(record => this.normalize(store, type, record));
  }

  // Query records
  async query(store: any, type: any, query: any): Promise<any[]> {
    // ... query logic
  }

  // Create record
  async createRecord(store: any, type: any, snapshot: any): Promise<any> {
    const db = this.dexieService.dexie(this.modelName);
    const data = this.serialize(snapshot);
    await db.table(this.modelName).put(data);
    return data;
  }

  // Update record
  async updateRecord(store: any, type: any, snapshot: any): Promise<any> {
    const db = this.dexieService.dexie(this.modelName);
    const data = this.serialize(snapshot);
    await db.table(this.modelName).put(data);
    return data;
  }

  // Delete record
  async deleteRecord(store: any, type: any, snapshot: any): Promise<void> {
    const db = this.dexieService.dexie(this.modelName);
    const id = snapshot.id || snapshot.get('id');
    await db.table(this.modelName).delete(id);
  }

  // Clear all records
  async clear(modelName: string): Promise<void> {
    const db = this.dexieService.dexie(modelName);
    await db.table(modelName).clear();
  }

  // Normalize record
  normalize(store: any, type: any, record: any): any {
    // ... normalization logic
  }

  // Serialize snapshot
  serialize(snapshot: any): any {
    // ... serialization logic
  }
}
```

## Порядок действий при переносе

1. Создать `OfflineAdapter` класс
2. Реализовать CRUD методы (find, findAll, query, create, update, delete)
3. Интеграция с DEXIE.js
4. Нормализация и сериализация данных

## Оценка трудозатрат

≈ 8–12 часов (medium)

## Чек-лист для разработчика

- [ ] `OfflineAdapter` класс создан
- [ ] CRUD методы реализованы
- [ ] DEXIE.js integration
- [ ] normalize/serialize methods
- [ ] Error handling
- [ ] Тесты переписаны

## Примечания

- Ember Data Adapter → TypeScript class
- IndexedDB через Dexie.js
