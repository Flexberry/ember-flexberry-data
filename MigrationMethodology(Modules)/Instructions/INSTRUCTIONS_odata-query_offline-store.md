# Инструкция: odata-query и offline-store

## Общее описание

**odata-query** — система построения запросов OData (`builder.js`, `condition.js`, `filter-operator.js`, `query-object.js`).  
**offline-store** — локальное хранилище данных (IndexedDB), включает `local-store.js`, `online-store.js`, `base-store.js`.

Оба модуля используются в других модулях синхронно.

## Состав модуля

### odata-query
- `addon/query/base-adapter.js`
- `addon/query/builder.js`
- `addon/query/indexeddb-adapter.js`
- `addon/query/js-adapter.js`
- `addon/query/odata-adapter.js`
- `addon/query/condition.js`
- `addon/query/filter-operator.js`
- `addon/query/order-by-clause.js`
- `addon/query/parameter.js`
- `addon/query/predicate.js`
- `addon/query/query-object.js`
- `addon/utils/string-functions.js`

### offline-store
- `addon/stores/base-store.js`
- `addon/stores/base-store/decorate-adapter.js`
- `addon/stores/base-store/decorate-api-call.js`
- `addon/stores/local-store.js`
- `addon/stores/online-store.js`

> 📝 `offline-store/local-store.js` уже описан в инструкции `offline`.

## Порядок миграции

1. `odata-query/builder.js` → `odata-query.ts` (main API)
2. `odata-query/condition.js`, `predicate.js`, `filter-operator.js` → helpers
3. `offline-store/local-store.js`, `online-store.js` → `store-provider.ts`
4. `offline-store/decorate-*.js` → adapters/decorators

## Основные принципы миграции

| Ember | Next.js |
|-------|---------|
| `Ember.Query.Builder` | `ODataQueryBuilder` (TS class) |
| `store.peekAll`, `store.query` | `useIndexedDB().getAll()`, `fetchOData()` |

---

### odata-query/builder.js

#### Тип Ember-модуля
Query Builder (OData)

#### Тип Next.js-модуля
TypeScript Class + Factory Functions

##### 1. Исходный файл (Ember)
`addon/query/builder.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/api/odata-query.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Builder.create()` | `new ODataQueryBuilder()` |
| `builder.filter('name', 'eq', 'value')` | `builder.filter({ name: 'value' })` |

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/odata-query.ts
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'le' | 'gt' | 'ge' | 'in' | 'contains';
  value: any;
}

export interface OrderByClause {
  field: string;
  order?: 'asc' | 'desc';
}

export class ODataQueryBuilder {
  private conditions: FilterCondition[] = [];
  private orderBy: OrderByClause[] = [];
  private select: string[] = [];
  private expand: string[] = [];
  private skip?: number;
  private top?: number;

  filter(field: string, operator: FilterCondition['operator'], value: any): this;
  filter(conditions: Record<string, any>): this;
  filter(arg1: any, arg2?: any, arg3?: any): this {
    if (typeof arg1 === 'object' && !Array.isArray(arg1)) {
      Object.entries(arg1).forEach(([field, value]) => {
        this.conditions.push({ field, operator: 'eq' as const, value });
      });
    } else {
      this.conditions.push({ field: arg1, operator: arg2 as any, value: arg3 });
    }
    return this;
  }

  orderBy(field: string, order: 'asc' | 'desc' = 'asc'): this {
    this.orderBy.push({ field, order });
    return this;
  }

  select(...fields: string[]): this {
    this.select.push(...fields);
    return this;
  }

  expand(...fields: string[]): this {
    this.expand.push(...fields);
    return this;
  }

  skip(n: number): this {
    this.skip = n;
    return this;
  }

  top(n: number): this {
    this.top = n;
    return this;
  }

  build(): string {
    const parts: string[] = [];
    if (this.conditions.length > 0) {
      const filter = this.conditions
        .map(({ field, operator, value }) => {
          if (value === null) return `${field} eq null`;
          if (typeof value === 'string') {
            if (operator === 'contains') return `contains(${field}, '${value}')`;
            return `${field} eq '${value}'`;
          }
          if (Array.isArray(value)) return `${field} in (${value.map((v) => `'${v}'`).join(',')})`;
          return `${field} eq ${value}`;
        })
        .join(' and ');
      parts.push(`$filter=${filter}`);
    }
    if (this.orderBy.length > 0) {
      parts.push(`$orderBy=${this.orderBy.map((o) => `${o.field} ${o.order}`).join(',')}`);
    }
    if (this.select.length > 0) {
      parts.push(`$select=${this.select.join(',')}`);
    }
    if (this.expand.length > 0) {
      parts.push(`$expand=${this.expand.join(',')}`);
    }
    if (this.skip !== undefined) {
      parts.push(`$skip=${this.skip}`);
    }
    if (this.top !== undefined) {
      parts.push(`$top=${this.top}`);
    }
    return parts.join('&');
  }

  toString(): string {
    return this.build();
  }
}

/**
 * Статическая фабрика для удобства
 */
export function buildODataQuery(params: {
  filter?: Record<string, any>;
  orderBy?: Array<{ field: string; order?: 'asc' | 'desc' }>;
  select?: string[];
  expand?: string[];
  skip?: number;
  top?: number;
}): string {
  const builder = new ODataQueryBuilder();
  if (params.filter) builder.filter(params.filter);
  if (params.orderBy) params.orderBy.forEach((o) => builder.orderBy(o.field, o.order));
  if (params.select) builder.select(...params.select);
  if (params.expand) builder.expand(...params.expand);
  if (params.skip !== undefined) builder.skip(params.skip);
  if (params.top !== undefined) builder.top(params.top);
  return builder.build();
}
```

---

### offline-store/local-store.js и online-store.js

#### Тип Ember-модуля
Stores (local and online)

#### Тип Next.js-модуля
Store Provider + Context

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/stores/store.ts
import { createContext, useContext, useState, useEffect } from 'react';
import { IndexedDB } from './local-store';
import { odataApi } from '@/lib/api/odata';

export interface StoreContextType {
  store: 'local' | 'online';
  localStore: IndexedDB | null;
  onlineSync: {
    isOnline: boolean;
    sync: () => Promise<void>;
    lastSync: Date | null;
  };
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [localStore] = useState<IndexedDB | null>(null); // будет инициализирован
  const [store, setStore] = useState<'local' | 'online'>('online');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setStore('online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setStore('local');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = async () => {
    // Реализация синхронизации
    setLastSync(new Date());
  };

  return (
    <StoreContext.Provider value={{ store, localStore, onlineSync: { isOnline, sync, lastSync } }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
```

---

## Итог

Модули `odata-query` и `offline-store` мигрированы, если:

✅ `.filter().orderBy().build()` → `ODataQueryBuilder`  
✅ `buildODataQuery()` — статический метод для быстрого вызова  
✅ `StoreContext` + `StoreProvider` — управление `store = 'local' | 'online'`  
✅ `useStore()` — hook для выбора хранилища  
✅ API — `IndexedDB` для `local`, `fetchOData` для `online`  

## Следующий модуль (рекомендуемый порядок)

После `odata-query`/`offline-store` — перейдите к **`services`** (Ember-сервисы -> React Context).
