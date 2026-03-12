# Инструкция: initializers, instance-initializers

## Общее описание

Модули `initializers` и `instance-initializers` содержат инициализаторы приложения — функции, выполняемые при загрузке Ember-приложения. В Next.js 16 они мигрируются в Server Layouts и Client Layouts.

## Состав модуля (файлы)

### initializers
- `addon/initializers/flexberry-enum.js`
- `addon/initializers/local-store.js`
- `addon/initializers/offline-globals.js`
- `app/initializers/flexberry-enum.js` — дубликат
- `app/initializers/local-store.js` — дубликат
- `app/initializers/offline-globals.js` — дубликат

### instance-initializers
- `addon/instance-initializers/set-singletons.js`
- `app/instance-initializers/set-singletons.js` — дубликат

> 📝 Примечание: Дубликаты `app/` не требуют отдельной миграции.

## Порядок миграции файлов внутри модулей

1. `flexberry-enum.js` (initializer) → `app/lib/initializers/flexberry-enum.ts`
2. `local-store.js` (initializer) → `app/lib/initializers/local-store.ts`
3. `offline-globals.js` (initializer) → `app/lib/initializers/offline-globals.ts`
4. `set-singletons.js` (instance-initializer) → `app/lib/initializers/set-singletons.ts`

## Особенности реализации

- Ember- инициализаторы: `initialize(app)` → Next.js: просто вызов функции
- `instance-initializers`: `initialize(app, instance)` → Next.js: в `app/layout.tsx` или `app/providers.tsx`
- Ember `app` object → Next.js: React App tree (не нужен, `app` заменяется на Layout)

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `app.register`, `app.inject`, `app.instanceInitializer` | React Context + Provider tree |
| `app.on('didInitialize')` | React `useEffect` или `useState` с `useEffect` |
| `app.inject.service` | React Context + `useContext` |

---

### Файл: `addon/initializers/flexberry-enum.js`

#### Тип Ember-модуля
Application Initializer (register enum utils)

#### Тип Next.js-модуля
Provider / Setup Function

##### 1. Исходный файл (Ember)
`addon/initializers/flexberry-enum.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/flexberry-enum.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `app.register('utils:enums', EnumsService)` | React Context (`EnumContext`) |
| `app.inject.service` | `useContext(EnumContext)` |

##### 4. Зависимости
- `typescript`
- `react`
- `app/lib/types/enums.ts`
- `app/lib/utils/enum.ts`

##### 5. Алгоритм миграции
1. Удалите Ember `app.register`
2. Создайте `EnumContext` + `EnumProvider`
3. Объект `enums` → передаётся в `value` Provider
4. В компоненте используйте `useContext(EnumContext)` вместо `lookup('utils:enums')`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/enums.ts
// (уже создано в transform)
export enum AuditOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
}

export enum ExecutionVariant {
  SYNCHRONOUS = 'SYNCHRONOUS',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  BATCH = 'BATCH',
}

// app/lib/initializers/flexberry-enum.ts
import {
  createContext,
  useContext,
} from 'react';

interface EnumContextType {
  enumTypes: {
    auditOperationType: typeof AuditOperationType;
    executionVariant: typeof ExecutionVariant;
  };
}

export const EnumContext = createContext<EnumContextType | undefined>(undefined);

export function EnumProvider({ children }: { children: React.ReactNode }) {
  const enumTypes = {
    auditOperationType: AuditOperationType,
    executionVariant: ExecutionVariant,
  };

  return (
    <EnumContext.Provider value={{ enumTypes }}>
      {children}
    </EnumContext.Provider>
  );
}

export function useEnums() {
  const context = useContext(EnumContext);
  if (!context) throw new Error('useEnums must be used within EnumProvider');
  return context;
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `app.register`
- [ ] `EnumContext` + `EnumProvider` реализованы
- [ ] `useEnums` — custom hook
- [ ] `app/layout.tsx` → `app/providers.tsx` → `EnumProvider`
- [ ] Тесты — `vitest` + `@testing-library/react`

---

### Файл: `addon/initializers/local-store.js`

#### Тип Ember-модуля
Application Initializer (IndexedDB setup)

#### Тип Next.js-модуля
IndexedDB Provider / Setup

##### 1. Исходный файл (Ember)
`addon/initializers/local-store.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/local-store.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `app.register('store:local', LocalStore)` | React Context (`IndexedDBContext`) |
| Основной вызов `localStore.open()` | `useEffect` в `Layout` / `IndexedDBProvider` |

##### 4. Зависимости
- `typescript`
- `app/lib/stores/local-store.ts` (из модуля `offline-store`)
- `app/lib/initializers/flexberry-enum.ts` (если используется)

##### 5. Алгоритм миграции
1. Удалите `app.register`
2. Используйте `IndexedDBContext`
3. `open()` → при монтировании (`useEffect`)
4. `close()` → при размонтировании (`useEffect` cleanup)

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/initializers/local-store.ts
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { IndexedDB } from '@/lib/stores/local-store';

interface IndexedDBContextType {
  db: IndexedDB | null;
  error: Error | null;
}

export const IndexedDBContext = createContext<IndexedDBContextType | undefined>(undefined);

export function IndexedDBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<IndexedDB | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbInstance = new IndexedDB();
        await dbInstance.open('flexberry-db');
        setDb(dbInstance);
      } catch (e) {
        console.error('Failed to open IndexedDB:', e);
        setError(e as Error);
      }
    };

    initDB();
  }, []);

  useEffect(() => {
    return () => {
      if (db) {
        db.close();
      }
    };
  }, [db]);

  return (
    <IndexedDBContext.Provider value={{ db, error }}>
      {children}
    </IndexedDBContext.Provider>
  );
}

export function useIndexedDB() {
  const context = useContext(IndexedDBContext);
  if (!context) throw new Error('useIndexedDB must be used within IndexedDBProvider');
  return context;
}
```

##### 7. Чек-лист качества
- [ ] `IndexedDBContext` + `IndexedDBProvider` реализованы
- [ ] `useEffect` для открытия/закрытия
- [ ] `useIndexedDB` —custom hook
- [ ] Тесты — `vitest` + `msw`

---

### Файл: `addon/initializers/offline-globals.js`

#### Тип Ember-модуля
Application Initializer (set global offline config)

#### Тип Next.js-модуля
Environment Variables + Provider

##### 1. Исходный файл (Ember)
`addon/initializers/offline-globals.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/offline-globals.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.get` → `process.env` | `process.env.NEXT_PUBLIC_...` |
| `app.register` / `app.inject` | React Context (`OfflineGlobalsContext`) |

##### 4. Зависимости
- `typescript`
- `react`

##### 5. Алгоритм миграции
1. Удалите `app.register`
2. Используйте `process.env.NEXT_PUBLIC_OFFLINE_ENABLED`
3. Добавьте `OfflineGlobalsContext`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/initializers/offline-globals.ts
import { createContext, useContext } from 'react';

export interface OfflineGlobalsType {
  offlineEnabled: boolean;
  syncInterval: number;
  retryAttempts: number;
}

export const OfflineGlobalsContext = createContext<OfflineGlobalsType | undefined>(undefined);

export function OfflineGlobalsProvider({ children }: { children: React.ReactNode }) {
  const offlineEnabled = process.env.NEXT_PUBLIC_OFFLINE_ENABLED === 'true';
  const syncInterval = parseInt(process.env.NEXT_PUBLIC_SYNC_INTERVAL || '5000', 10);
  const retryAttempts = parseInt(process.env.NEXT_PUBLIC_RETRY_ATTEMPTS || '3', 10);

  return (
    <OfflineGlobalsContext.Provider
      value={{ offlineEnabled, syncInterval, retryAttempts }}
    >
      {children}
    </OfflineGlobalsContext.Provider>
  );
}

export function useOfflineGlobals() {
  const context = useContext(OfflineGlobalsContext);
  if (!context) throw new Error('useOfflineGlobals must be used within OfflineGlobalsProvider');
  return context;
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `app.register`
- [ ] Используется `process.env.NEXT_PUBLIC_...`
- [ ] `OfflineGlobalsContext` + `OfflineGlobalsProvider`
- [ ] Тесты — `vitest`

---

### Файл: `addon/instance-initializers/set-singletons.js`

#### Тип Ember-модуля
Instance Initializer (set singletons)

#### Тип Next.js-модуля
Singleton Provider (для сервисов)

##### 1. Исходный файл (Ember)
`addon/instance-initializers/set-singletons.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/set-singletons.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `instance.register` / `instance.inject` | React Context + Provider |
| `app.lookup('service:X')` | `useContext(ServiceContext)` |

##### 4. Зависимости
- `typescript`
- `react`

##### 5. Алгоритм миграции
1. Удалите `instance.register`, `instance.inject`
2. Если singleton — сервис, используйте `ServiceContext`
3. Поместите `ServiceContext.Provider` в `app/layout.tsx`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/initializers/set-singletons.ts
import { createContext, useContext } from 'react';

// Для каждого singleton-сервиса
export interface SyncerServiceContextType {
  sync: () => void;
  lastSync: Date | null;
}

export const SyncerServiceContext = createContext<SyncerServiceContextType | undefined>(undefined);

export function SyncerServiceProvider({ children }: { children: React.ReactNode }) {
  // Реальный singleton — в рендер, но создается один раз
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const sync = () => {
    // ... sync logic
    setLastSync(new Date());
  };

  return (
    <SyncerServiceContext.Provider value={{ sync, lastSync }}>
      {children}
    </SyncerServiceContext.Provider>
  );
}

export function useSyncer() {
  const context = useContext(SyncerServiceContext);
  if (!context) throw new Error('useSyncer must be used within SyncerServiceProvider');
  return context;
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `instance.register`, `instance.inject`
- [ ] `SyncerServiceContext` + `SyncerServiceProvider`
- [ ] `useSyncer` — custom hook
- [ ] Тесты — `vitest`

---

## Итог

Модули `initializers` и `instance-initializers` мигрированы, если:

✅ `EnumContext` + `EnumProvider` создан  
✅ `IndexedDBContext` + `IndexedDBProvider` создан  
✅ `OfflineGlobalsContext` + `OfflineGlobalsProvider` создан  
✅ `SyncerServiceContext` + ServiceContext созданы  
✅ Все代替 использованием Ember — `useContext`, `useEffect`  

## Следующий модуль (рекомендуемый порядок)

После `initializers`/`instance-initializers` — перейдите к **`generated-models`**, так как он зависит от `core-models`, `audit`, и использует `transforms`.
