# Модуль: syncer-service

## Файлы
- addon/services/syncer.js
- app/services/syncer.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service (обязательно)
- dexie-service (обязательно)
- queue-utils (для `_syncDownQueue`)
- reload-local-records-utils (для `reloadLocalRecords`, `createLocalRecord`)
- is-async-utils (для `isAsync`)
- string-functions-utils (для `camelize`, `capitalize`)
- attributes-utils (для projections)
- batch-queries-utils (для batch sync up)

## Рекомендации по переносу

### Service → TypeScript Class or Hook

**Ember:** `Service.extend({})` → **Next.js:** `src/services/syncerService.ts`

**Пример шаблона:**
```ts
// services/syncerService.ts
import { Queue } from './queue';
import { reloadLocalRecords, createLocalRecord } from './reloadLocalRecords';

export class SyncerService {
  private _syncDownQueue: Queue;
  private _recordsToUnload: any[] = [];
  private offlineStore: any;

  numberOfRecordsForPerformingBulkOperations: number = 10;
  queueContinueOnError: boolean = true;
  auditEnabled: boolean = true;

  constructor() {
    this._syncDownQueue = new Queue();
    this._syncDownQueue.continueOnError = true;
  }

  // Sync down method
  async syncDown(descriptor: string | any, reload?: boolean, projectionName?: string, params?: any): Promise<any> {
    if (typeof descriptor === 'string') {
      return reloadLocalRecords.call(this, descriptor, reload, projectionName, params);
    }
    // ... rest of logic
  }

  // Sync up method
  async syncUp(jobs?: any[], options?: any): Promise<any> {
    // ... sync up logic with batch support
  }

  // Create audit job
  async createJob(record: any): Promise<any> {
    // ... create audit entity and fields
  }

  // Resolve server errors
  resolveServerError(job: any, error: any): Promise<any> {
    job.executionResult = 'Ошибка';
    return job.save();
  }

  // Resolve not found records
  resolveNotFoundRecord(job: any): Promise<any> {
    job.executionResult = 'Не выполнено';
    return job.save();
  }

  // Get sync up projection name
  getSyncUpProjectionName(store: any, modelName: string): string | null {
    const modelClass = store.modelFor(modelName);
    // ... projection name logic
  }
}

// React Hook
import { useState, useEffect } from 'react';

export function useSyncer() {
  const [syncerService] = useState(() => new SyncerService());
  return syncerService;
}
```

## Порядок действий при переносе

1. Перенести все зависимости (7 модулей)
2. Создать `SyncerService` класс
3. Реализовать `syncDown()`, `syncUp()` методы
4. Интеграция с `reloadLocalRecords`
5. Создать React hook

## Оценка трудозатрат

≈ 12-16 часов (high)

## Чек-лист для разработчика

- [ ] all 7 dependencies перенесены
- [ ] `SyncerService` класс создан
- [ ] `syncDown()` реализован
- [ ] `syncUp()` реализован
- [ ] Batch sync up support
- [ ] Audit entity creation
- [ ] React hook создан
- [ ] Тесты переписаны

## Примечания

- Ember Service → TypeScript class
- Queue для синхронизации
- Batch update support для sync up
