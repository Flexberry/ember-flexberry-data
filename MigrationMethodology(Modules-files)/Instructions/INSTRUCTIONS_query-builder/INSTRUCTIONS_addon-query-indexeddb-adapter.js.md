# Инструкция по миграции: addon/query/indexeddb-adapter.js

## 📋 Тип Ember-модуля
- **Ember тип:** indexeddb adapter
- **Next.js тип:** IndexedDB wrapper

## 📁 Исходный файл (Ember)
```
// addon/query/indexeddb-adapter.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // IndexedDB logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/db/indexeddb.ts` — IndexedDB wrapper

## 📦 Зависимости
- idb (IndexedDB library)
- typescript

## 📝 Готовый код

```typescript
// app/lib/db/indexeddb.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface QueryDB extends DBSchema {
  queries: {
    key: string;
    value: {
      key: string;
      data: any;
    };
  };
}

let db: IDBPDatabase<QueryDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<QueryDB>> {
  if (!db) {
    db = await openDB<QueryDB>('QueryDB', 1, {
      upgrade(db) {
        db.createObjectStore('queries', { keyPath: 'key' });
      },
    });
  }
  return db;
}

export async function saveQuery(key: string, data: any) {
  const db = await getDB();
  await db.put('queries', { key, data });
}

export async function getQuery<T>(key: string): Promise<T | null> {
  const db = await getDB();
  const record = await db.get('queries', key);
  return record ? record.data : null;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/db/indexeddb.ts` создан
- [ ] Функции `saveQuery`, `getQuery` работают
