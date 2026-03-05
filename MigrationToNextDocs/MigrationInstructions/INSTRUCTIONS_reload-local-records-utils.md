# Модуль: reload-local-records-utils

## Файлы
- addon/utils/reload-local-records.js

## Зависимости (должны быть перенесены ДО этого модуля)
- batch-queries-utils
- information-utils
- is-embedded-utils
- queue-utils

## Рекомендации по переносу

### Utils → Async Functions

**Ember:** `addon/utils/reload-local-records.js` → **Next.js:** `src/utils/reloadLocalRecords.ts`

**Пример шаблона:**
```ts
// utils/reloadLocalRecords.ts
import { Queue } from './queue';

export async function reloadLocalRecords(
  type: any,
  reload: boolean,
  projectionName?: string,
  params?: any
): Promise<any> {
  const store = type.store; // assuming type has store reference
  const modelType = store.modelFor(type.modelName);
  const modelName = modelType.modelName;

  const localStore = store.localStore; // assuming localStore available
  const localAdapter = localStore.adapterFor(modelName);

  const reloadedRecords = await localAdapter.clear(modelName);
  await reloadedRecords;

  return createAll();

  async function createAll() {
    const projection = projectionName ? modelType.projections?.[projectionName] : null;
    
    if (reload) {
      // ... reload from server
    } else {
      const records = store.peekAll(type);
      return createLocalRecords.call(this, store, localAdapter, localStore, modelType, records, projection, params);
    }
  }
}

export async function createLocalRecord(
  store: any,
  localAdapter: any,
  localStore: any,
  modelType: any,
  record: any,
  projection: any,
  params: any
): Promise<any> {
  const dexieService = store.dexieService; // assuming available
  if (params && params.unloadSyncedRecords) {
    // ... recordsToUnload logic
  }

  // ... create record logic
}

export async function syncDownRelatedRecords(
  store: any,
  mainRecord: any,
  localAdapter: any,
  localStore: any,
  projection: any,
  params: any
): Promise<any> {
  // ... sync down related records logic
}
```

## Порядок действий при переносе

1. Перенести зависимости (batch-queries, information, is-embedded, queue)
2. Создать `reloadLocalRecords()` функцию
3. Создать `createLocalRecord()` function
4. Создать `syncDownRelatedRecords()` function
5. Обработать async/await логику

## Оценка трудозатрат

≈ 6–8 часов (medium)

## Чек-лист для разработчика

- [ ] all dependencies перенесены
- [ ] `reloadLocalRecords()` реализована
- [ ] `createLocalRecord()` реализована
- [ ] `syncDownRelatedRecords()` реализована
- [ ] async/await логика сохранена
- [ ] Тесты переписаны

## Примечания

- Много вложенных async operations
- Использовать `Queue` для порядка выполнения
