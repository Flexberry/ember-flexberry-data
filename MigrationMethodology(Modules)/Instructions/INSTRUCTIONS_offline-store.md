# Инструкция: offline-store (отдельно)

## Общее описание

Модуль `offline-store` — это локальное хранилище данных, основанное на IndexedDB. Он реализует абстракцию хранилища и поддерживает синхронизацию между онлайн и оффлайн режимами.

## Состав модуля

- `addon/stores/base-store.js`
- `addon/stores/base-store/decorate-adapter.js`
- `addon/stores/base-store/decorate-api-call.js`
- `addon/stores/local-store.js`
- `addon/stores/online-store.js`

## Порядок миграции

1. `local-store.js` → `IndexedDB` (через `idb`)
2. `online-store.js` → `OData API`
3. `base-store.js` → `StoreContext`
4. `decorate-*.js` → `-store-decorators.ts`

## Пример: local-store.js

```typescript
// app/lib/stores/local-store.ts (уже в инструкции offline)
```

## Пример: base-store.js

```typescript
// app/lib/stores/store.ts (уже в инструкции odata-query/online-store)
```

## Пример: decorate-*.js

```typescript
// app/lib/stores/decorators.ts

export function decorateWithCache<T>(store: T): T & { cache: Map<string, any> } {
  const cache = new Map<string, any>();
  return { ...store, cache };
}

export function decorateWithRetry<T>(store: T): T & { retry: (fn: () => Promise<any>) => Promise<any> } {
  const retry = async (fn: () => Promise<any>, attempts = 3): Promise<any> => {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        if (i === attempts - 1) throw e;
      }
    }
    throw new Error('Unreachable');
  };
  return { ...store, retry };
}
```

---

## Итог

- ✅ `IndexedDB` через `idb`
- ✅ `StoreContext` для режимов `local`/`online`
- ✅ `decorateWithCache`, `decorateWithRetry` — декораторы
