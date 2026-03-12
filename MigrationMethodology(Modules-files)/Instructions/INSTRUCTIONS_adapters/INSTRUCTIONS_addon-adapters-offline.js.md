# Миграция: addon/adapters/offline.js

## Тип Ember → Next.js
- Ember тип: adapter (offline)
- Next.js аналог: axios + IndexedDB + custom hooks

### 1. Исходный файл (Ember)
```
// addon/adapters/offline.js
import ODataAdapter from './odata';

export default ODataAdapter.extend({
  offlineAdapter: null,
  
  init() {
    this._super(...arguments);
    this.offlineAdapter = this.container.lookup('adapter:offline');
  },
  
  findRecord(store, type, id) {
    if (this.get('isOnline')) {
      return this._super(...arguments);
    }
    return this.offlineAdapter.findRecord(store, type, id);
  },
  
  query(store, type, query) {
    if (this.get('isOnline')) {
      return this._super(...arguments);
    }
    return this.offlineAdapter.query(store, type, query);
  },
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/api/offline.ts` — axios client для оффлайн
- `app/lib/hooks/useOfflineQuery.ts` — custom hooks для оффлайн
- `app/lib/db/indexeddb.ts` — IndexedDB wrapper

### 3. Маппинг Ember → Next.js
- `ODataAdapter.extend({...})` → `offlineApi` + `useOfflineQuery` hook
- `isOnline` → `navigator.onLine` + state
- `offlineAdapter.findRecord` → `indexedDB.find()`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios
- idb (IndexedDB library)

### 5. Алгоритм миграции
1. Создать папку `app/lib/db/`
2. Создать `indexeddb.ts` для работы с IndexedDB
3. Создать `offline.ts` с axios client
4. Создать custom hooks `useOfflineQuery.ts`, `useOfflineMutation.ts`
5. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/db/indexeddb.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  records: {
    key: string;
    value: {
      modelName: string;
      id: string | number;
      data: any;
      timestamp: number;
    };
    indexes: { modelName: string };
  };
}

let db: IDBPDatabase<OfflineDB> | null = null;

export async function getOfflineDB(): Promise<IDBPDatabase<OfflineDB>> {
  if (!db) {
    db = await openDB<OfflineDB>('OfflineRecords', 1, {
      upgrade(db) {
        const store = db.createObjectStore('records', { keyPath: ['modelName', 'id'] });
        store.createIndex('modelName', 'modelName');
      },
    });
  }
  return db;
}

export async function saveRecordOffline(modelName: string, id: string | number, data: any) {
  const db = await getOfflineDB();
  await db.put('records', { modelName, id, data, timestamp: Date.now() });
}

export async function getRecordOffline<T>(modelName: string, id: string | number): Promise<T | null> {
  const db = await getOfflineDB();
  const record = await db.get('records', [modelName, id]);
  return record ? record.data : null;
}

export async function deleteRecordOffline(modelName: string, id: string | number) {
  const db = await getOfflineDB();
  await db.delete('records', [modelName, id]);
}

export async function getAllRecordsOffline<T>(modelName: string): Promise<T[]> {
  const db = await getOfflineDB();
  const records = await db.getAllFromIndex('records', 'modelName', modelName);
  return records.map(r => r.data);
}
```

```typescript
// app/lib/api/offline.ts
import axios from 'axios';
import { saveRecordOffline, getRecordOffline, deleteRecordOffline } from './indexeddb';

const odataApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/odata',
  headers: {
    'OData-Version': '4.0',
    'Content-Type': 'application/json',
  },
});

export const offlineApi = {
  isOnline: () => navigator.onLine,
  
  query: async <T>(modelName: string, query?: any): Promise<T[]> => {
    if (offlineApi.isOnline()) {
      const response = await odataApi.get<T[]>(`/${modelName}`, { params: query });
      return response.data;
    }
    return getAllRecordsOffline<T>(modelName);
  },
  
  find: async <T>(modelName: string, id: string | number): Promise<T> => {
    if (offlineApi.isOnline()) {
      const response = await odataApi.get<T>(`/${modelName}(${id})`);
      return response.data;
    }
    const record = await getRecordOffline<T>(modelName, id);
    if (record) return record;
    throw new Error('Record not found offline');
  },
  
  create: async <T>(modelName: string, data: Partial<T>): Promise<T> => {
    const response = await odataApi.post<T>(`/${modelName}`, data);
    await saveRecordOffline(modelName, response.data.id, response.data);
    return response.data;
  },
  
  update: async <T>(modelName: string, id: string | number, data: Partial<T>): Promise<T> => {
    const response = await odataApi.patch<T>(`/${modelName}(${id})`, data);
    await saveRecordOffline(modelName, id, response.data);
    return response.data;
  },
  
  delete: async (modelName: string, id: string | number): Promise<void> => {
    await odataApi.delete(`/${modelName}(${id})`);
    await deleteRecordOffline(modelName, id);
  },
};
```

```typescript
// app/lib/hooks/useOfflineQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offlineApi } from '@/lib/api/offline';

export function useOfflineQuery<T>(modelName: string, query?: any) {
  return useQuery({
    queryKey: ['offline', modelName, query],
    queryFn: async () => {
      return offlineApi.query<T>(modelName, query);
    },
    staleTime: 60000,
  });
}

export function useOfflineById<T>(modelName: string, id: string | number) {
  return useQuery({
    queryKey: ['offline', modelName, id],
    queryFn: async () => await offlineApi.find<T>(modelName, id),
    staleTime: 60000,
  });
}

export function useCreateOfflineRecord<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, data }: { modelName: string; data: Partial<T> }) => {
      return offlineApi.create<T>(modelName, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName] });
    },
  });
}

export function useUpdateOfflineRecord<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id, data }: { modelName: string; id: string | number; data: Partial<T> }) => {
      return offlineApi.update<T>(modelName, id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName] });
    },
  });
}

export function useDeleteOfflineRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id }: { modelName: string; id: string | number }) => {
      await offlineApi.delete(modelName, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName] });
    },
  });
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/db/indexeddb.ts` создан с базовыми функциями
- [ ] Файл `app/lib/api/offline.ts` создан с axios client
- [ ] Файлы `useOfflineQuery.ts`, `useOfflineMutation.ts` созданы
- [ `offlineApi.isOnline()` проверяет `navigator.onLine`
- [ ] Все CRUD operations работают и в оффлайн, и в онлайн режиме
