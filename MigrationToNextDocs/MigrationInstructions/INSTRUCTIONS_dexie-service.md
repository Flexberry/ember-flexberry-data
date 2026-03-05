# Модуль: dexie-service

## Файлы
- addon/services/dexie.js
- app/services/dexie.js

## Зависимости (должны быть перенесены ДО этого модуля)
- queue-utils

## Рекомендации по переносу

### Service → TypeScript Class or Hook

**Ember:** `Service.extend({})` → **Next.js:** `src/services/dexieService.ts`

**Пример шаблона:**
```ts
// services/dexieService.ts
import { Queue } from './queue';

export class DexieService {
  private _dbs: Map<string, any> = new Map();
  private _queue: Queue;
  public queueSyncDownWorksCount: number = 0;
  public queueSyncUpTotalWorksCount: number = 0;
  public queueSyncUpWorksCount: number = 0;

  constructor() {
    this._queue = new Queue();
  }

  // Get Dexie DB instance
  dexie(dbName: string, options?: any): any {
    if (!this._dbs.has(dbName)) {
      const db = this.createDexieDB(dbName, options);
      this._dbs.set(dbName, db);
    }
    return this._dbs.get(dbName);
  }

  // Create Dexie DB instance
  createDexieDB(dbName: string, options?: any): any {
    // ... create Dexie DB
  }

  // Setup tables
  async setupTables(isOnline: boolean): Promise<void> {
    // ... setup IndexedDB tables
  }

  // Get queue
  get queue(): Queue {
    return this._queue;
  }

  // Clear all DBs
  async clearAll(): Promise<void> {
    for (const db of this._dbs.values()) {
      await db.close();
    }
    this._dbs.clear();
  }
}

// React Hook wrapper
import { useState, useEffect } from 'react';

export function useDexie() {
  const [dexieService] = useState(() => new DexieService());
  return dexieService;
}
```

## Порядок действий при переносе

1. Перенести `queue-utils`
2. Создать `DexieService` класс
3. Реализовать `dexie()` method для получения DB instance
4. Создать React hook для удобства использования

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `queue-utils` перенесён
- [ ] `DexieService` класс создан
- [ ] `dexie()` method реализован
- [ ] React hook создан
- [ ] IndexedDB tables on setup
- [ ] Тесты переписаны

## Примечания

- Ember service → TypeScript class
- React hook для удобства
- IndexedDB через Dexie.js
