# Модуль: local-store

## Файлы
- addon/stores/local-store.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-store

## Рекомендации по переносу

### Store → Extended Store Class

**Ember:** `Service.extend({})` → **Next.js:** `src/stores/localStore.ts`

**Пример шаблона:**
```ts
// stores/localStore.ts
import { BaseStore } from './baseStore';

export class LocalStore extends BaseStore {
  // Local store specific methods

  // Clear all records
  async clear(modelName?: string): Promise<void> {
    if (modelName) {
      await this.dexieService.dexie(modelName).clear();
    } else {
      // Clear all tables
      for (const dbName of this.dexieService._dbs.keys()) {
        await this.dexieService.dexie(dbName).clear();
      }
    }
  }

  // Bulk operations
  async bulkUpdateOrCreate(store: any, modelName: string, records: any[], fieldsToUpdate?: string[]): Promise<void> {
    // ... bulk update or create logic
  }

  // Add hash for bulk operation
  async addHashForBulkUpdateOrCreate(store: any, modelName: string, snapshot: any, fieldsToUpdate: string[], forSyncDown: boolean): Promise<void> {
    // ... add hash logic
  }

  // Batch operations
  async batchUpdate(records: any[]): Promise<any[]> {
    // ... batch update logic
  }
}
```

## Порядок действий при переносе

1. Перенести `base-store`
2. Создать `LocalStore` класс
3. Реализовать local-specific methods
4. Bulk operations
5. Batch operations

## Оценка трудозатрат

≈ 8-10 часов (high)

## Чек-лист для разработчика

- [ ] `base-store` перенесён
- [ ] `LocalStore` класс создан
- [ ] clear method
- [ ] bulk operations
- [ ] batch operations
- [ ] Тесты переписаны

## Примечания

- Local store for IndexedDB
- Bulk operations support
