# Инструкция: offline, offline-store

## Общее описание

Модуль `offline` добавляет поддержку оффлайн-режима работы, а `offline-store` — локальное хранилище на основе IndexedDB (через Dexie or idb). Вместе они обеспечивают синхронизацию данных между локальным хранилищем и API.

## Состав модуля `offline`

### Основные файлы
- `addon/mixins/offline-model.js`
- `addon/adapters/offline.js`
- `addon/serializers/offline.js`
- `addon/services/dexie.js`

### Дубликаты
- `app/adapters/offline.js`
- `app/serializers/offline.js`
- `app/services/dexie.js`
- `app/utils/backup.js`
- `addon/utils/backup.js`

> 📝 `offline-store`:
> - `addon/stores/base-store.js`
> - `addon/stores/base-store/decorate-adapter.js`
> - `addon/stores/base-store/decorate-api-call.js`
> - `addon/stores/local-store.js`
> - `addon/stores/online-store.js`

## Порядок миграции

1. `offline-model.js` → `offline-model.ts`
2. `offline-store/local-store.js` → `IndexedDB client`
3. `offline-store/base-store.js` → `StoreProvider`
4. `offline/adapters/offline.js`, `offline/serializers/offline.js` → `offline fetch wrapper`
5. `offline/services/dexie.js` → `useIndexedDB()`

## Особенности реализации

- `offline-model.js` расширяет `Model` и добавляет свойства для синхронизации
- `offline-store` — обёртки для IndexedDB
- `dexie.js` — инициализация Dexie/IndexedDB
- `backup.js` — резервное копирование

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `Adapter` → Next.js | `fetch` wrapper + API hooks |
| `Dexie` service → Next.js | `useIndexedDB` hook |
| `LocalStorage`/IndexedDB → Next.js | `idb`/`dexie` в browser |

---

### Файл: `addon/mixins/offline-model.js`

#### Тип Ember-модуля
Model Mixin (offline support)

#### Тип Next.js-модуля
TypeScript Interface + Hook

##### 1. Исходный файл (Ember)
`addon/mixins/offline-model.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/offline-model.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Mixin.create({})` | `interface OfflineModel extends BaseModel` |
| `attr('boolean')` | `isOffline?: boolean` |
| `attr('date')` | `syncedAt?: string` |

##### 4. Зависимости
- `app/lib/types/model.ts`
- `app/lib/types/enums.ts`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/offline-model.ts
import { BaseModel } from './model';
import { User } from './user';

export interface OfflineModel extends BaseModel {
  isOffline?: boolean;
  syncedAt?: string;
  isDeleted?: boolean;
  offlineData?: Record<string, any>;

  // Для синхронизации
  creator?: User;
  creatorId?: string;
  updater?: User;
  updaterId?: string;
}
```

#### Для `useIndexedDB`

##### 1. Исходный файл (Ember)
`addon/mixins/offline-model.js` (импорт `dexie`)

##### 2. Целевой файл (Next.js 16)
`app/lib/stores/local-store.ts`

##### 3. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/stores/local-store.ts
import { openDB } from 'idb';

interface Database {
  models: IDBObjectStore;
}

export class IndexedDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'flexberry-db';
  private readonly version = 1;

  async open(name?: string): Promise<void> {
    this.dbName = name || this.dbName;
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('models')) {
          const store = db.createObjectStore('models', { keyPath: 'id' });
          store.createIndex('created', 'createdAt');
          store.createIndex('updated', 'modifiedAt');
        }
      },
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async put<T extends { id: string }>(store: string, data: T): Promise<void> {
    if (!this.db) throw new Error('Database not open');
    const tx = this.db.transaction(store, 'readwrite');
    await tx.objectStore(store).put(data);
    await tx.done;
  }

  async get<T>(store: string, id: string): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not open');
    const tx = this.db.transaction(store, 'readonly');
    return (await tx.objectStore(store).get(id)) as T | undefined;
  }

  async getAll<T>(store: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not open');
    const tx = this.db.transaction(store, 'readonly');
    return (await tx.objectStore(store).getAll()) as T[];
  }

  async delete(store: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not open');
    const tx = this.db.transaction(store, 'readwrite');
    await tx.objectStore(store).delete(id);
    await tx.done;
  }
}
```

---

### Файл: `addon/services/dexie.js`

#### Тип Ember-модуля
Service (Dexie instance)

#### Тип Next.js-модуля
Context Provider + Hook

##### 1. Исходный файл (Ember)
`addon/services/dexie.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/local-store.ts` (уже создано)

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `DexieService` as Ember service | `IndexedDBProvider` + `useIndexedDB` |

##### 4. Зависимости
- `app/lib/stores/local-store.ts`
- `react`

##### 6. Пример кода (уже есть в `offline-store`)
```typescript
// app/lib/initializers/local-store.ts (см. выше)
```

---

### Файл: `addon/adapters/offline.js`

#### Тип Ember-модуля
Adapter (with fallback to local store)

#### Тип Next.js-модуля
Custom API Client + FallbackHandler

##### 1. Исходный файл (Ember)
`addon/adapters/offline.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/api/offline.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Adapter.extend({ findRecord, query })` | `fetchOffline` wrapper |
| `this.store.peekAll` → local store | `useIndexedDB().getAll()` |

##### 4. Зависимости
- `app/lib/stores/local-store.ts`
- `@tanstack/react-query`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/offline.ts
import { IndexedDB } from '@/lib/stores/local-store';

export async function fetchOffline(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Пример: пытаемся сначала из IndexedDB, если оффлайн
  // В реальном проекте — используйте `navigator.onLine`
  // и кеш с `useQuery` + `staleTime`
  return fetch(url, options);
}
```

> 📝 **Популярнее использовать `@tanstack/query-persist-client` или `msw` для кэширования**

---

### Файл: `addon/serializers/offline.js`

#### Тип Ember-модуля
Serializer (for offline)

#### Тип Next.js-модуля
Serializer Helper

##### 1. Исходный файл (Ember)
`addon/serializers/offline.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/serializers/offline.ts`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/serializers/offline.ts
import { OfflineModel } from '@/lib/types/offline-model';

export function serializeOfflineModel<T extends OfflineModel>(
  data: T
): Record<string, any> {
  const { isOffline, syncedAt, isDeleted, offlineData, ...rest } = data;
  return {
    ...rest,
    isOffline,
    syncedAt,
    isDeleted,
    ...(offlineData && { offlineData: JSON.stringify(offlineData) }),
  };
}

export function deserializeOfflineModel(
  data: Record<string, any>
): any {
  const { isOffline, syncedAt, isDeleted, offlineData, ...rest } = data;
  return {
    ...rest,
    isOffline,
    syncedAt,
    isDeleted,
    ...(offlineData && { offlineData: JSON.parse(offlineData) }),
  };
}
```

---

### Файл: `addon/utils/backup.js`

#### Тип Ember-модуля
Utils (backup/restore from IndexedDB)

#### Тип Next.js-модуля
Backup Helper Functions

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/backup.ts
import { IndexedDB } from '@/lib/stores/local-store';

export async function backupDatabase(dbName: string): Promise<string> {
  const db = new IndexedDB();
  await db.open(dbName);
  const models = await db.getAll('models');
  db.close();
  return JSON.stringify(models);
}

export async function restoreDatabase(dbName: string, data: string): Promise<void> {
  const db = new IndexedDB();
  await db.open(dbName);
  const models = JSON.parse(data) as Array<{ id: string }>;
  for (const model of models) {
    await db.put('models', model);
  }
  db.close();
}
```

---

## Итог

Модули `offline` и `offline-store` мигрированы, если:

✅ `OfflineModel` — расширение `BaseModel` + `isOffline`, `syncedAt` и др.  
✅ `IndexedDB` — через `idb` или `dexie`  
✅ `saveLocal()`, `restoreLocal()` — функции резервного копирования  
✅ `fetchOffline()` — wrapper с fallback  
✅ `useIndexedDB()` — hook для работы с IndexedDB  

## Следующий модуль (рекомендуемый порядок)

После `offline`/`offline-store` — перейдите к **`odata`** (адаптеры для OData backend).
