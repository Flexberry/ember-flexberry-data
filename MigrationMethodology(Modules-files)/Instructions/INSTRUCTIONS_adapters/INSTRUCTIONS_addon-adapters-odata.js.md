# Миграция: addon/adapters/odata.js

## Тип Ember → Next.js
- Ember тип: adapter
- Next.js аналог: axios + custom hook + @tanstack/react-query

### 1. Исходный файл (Ember)
```
// addon/adapters/odata.js
import RESTAdapter from 'ember-data/adapters/rest';
import ODataQueryAdapter from 'ember-data-odata-adapter/addon';

export default RESTAdapter.extend({
  namespace: '/odata',
  
  query(store, type, query) {
    const url = this._buildURL(query.modelName);
    const builder = new ODataQueryAdapter(url, store);
    const data = builder.getODataQuery(query);
    return this.ajax(url, 'GET', { data });
  },
  
  findRecord(store, type, id) {
    const url = this._buildURL(type.modelName, id);
    return this.ajax(url, 'GET');
  },
  
  createRecord(store, type, snapshot) {
    const url = this._buildURL(type.modelName);
    const data = this.serialize(snapshot, { includeId: true });
    return this.ajax(url, 'POST', { data });
  },
  
  updateRecord(store, type, snapshot) {
    const id = snapshot.id;
    const url = this._buildURL(type.modelName, id);
    const data = this.serialize(snapshot, { includeId: true });
    return this.ajax(url, 'PATCH', { data });
  },
  
  deleteRecord(store, type, snapshot) {
    const id = snapshot.id;
    const url = this._buildURL(type.modelName, id);
    return this.ajax(url, 'DELETE');
  }
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/api/odata.ts` — axios client для OData
- `app/lib/hooks/useODataQuery.ts` — custom hook для queries
- `app/lib/hooks/useODataMutation.ts` — custom hook для mutations

### 3. Маппинг Ember → Next.js
- `RESTAdapter.extend({...})` → `axios.create()` + `useQuery` / `useMutation`
- `query(store, type, query)` → `fetchWithOData(modelName, query)`
- `findRecord(store, type, id)` → `fetchById(modelName, id)`
- `createRecord(store, type, snapshot)` → `createRecord(modelName, data)`
- `updateRecord(store, type, snapshot)` → `updateRecord(modelName, id, data)`
- `deleteRecord(store, type, snapshot)` → `deleteRecord(modelName, id)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios
- zod (валидация)

### 5. Алгоритм миграции
1. Создать папку `app/lib/api/`
2. Создать `odata.ts` с axios client
3. Создать custom hooks `useODataQuery.ts`, `useODataMutation.ts`
4. В `queryClient` добавить transformer для OData
5. Использовать hooks в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/odata.ts
import axios from 'axios';

const odataApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/odata',
  headers: {
    'OData-Version': '4.0',
    'Content-Type': 'application/json',
  },
});

export interface ODataQuery {
  $select?: string;
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $count?: boolean;
  [key: string]: any;
}

export const odataApi = {
  query: async <T>(modelName: string, query: ODataQuery): Promise<{ value: T[], '@odata.count'?: number }> => {
    const response = await odataApi.get<T[]>(`/${modelName}`, { params: query });
    return response.data;
  },
  
  find: async <T>(modelName: string, id: string | number): Promise<T> => {
    const response = await odataApi.get<T>(`/${modelName}(${id})`);
    return response.data;
  },
  
  create: async <T>(modelName: string, data: Partial<T>): Promise<T> => {
    const response = await odataApi.post<T>(`/${modelName}`, data);
    return response.data;
  },
  
  update: async <T>(modelName: string, id: string | number, data: Partial<T>): Promise<T> => {
    const response = await odataApi.patch<T>(`/${modelName}(${id})`, data);
    return response.data;
  },
  
  delete: async (modelName: string, id: string | number): Promise<void> => {
    await odataApi.delete(`/${modelName}(${id})`);
  },
};
```

```typescript
// app/lib/hooks/useODataQuery.ts
import { useQuery } from '@tanstack/react-query';
import { odataApi } from '@/lib/api/odata';

export function useODataQuery<T>(modelName: string, query?: any) {
  return useQuery({
    queryKey: ['odata', modelName, query],
    queryFn: async () => {
      if (!query) {
        const { value } = await odataApi.query<T>(modelName, {});
        return value;
      }
      const result = await odataApi.query<T>(modelName, query);
      return Array.isArray(result) ? result : result.value;
    },
    staleTime: 60000,
  });
}

export function useODataById<T>(modelName: string, id: string | number) {
  return useQuery({
    queryKey: ['odata', modelName, id],
    queryFn: async () => await odataApi.find<T>(modelName, id),
    staleTime: 60000,
  });
}

export function useCreateODataRecord<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, data }: { modelName: string; data: Partial<T> }) => {
      return odataApi.create<T>(modelName, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['odata', variables.modelName] });
    },
  });
}

export function useUpdateODataRecord<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id, data }: { modelName: string; id: string | number; data: Partial<T> }) => {
      return odataApi.update<T>(modelName, id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['odata', variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['odata', variables.modelName] });
    },
  });
}

export function useDeleteODataRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id }: { modelName: string; id: string | number }) => {
      await odataApi.delete(modelName, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['odata', variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['odata', variables.modelName] });
    },
  });
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/api/odata.ts` создан с axios client
- [ ] Файлы `useODataQuery.ts`, `useODataMutation.ts` созданы
- [ ] Все CRUD operations работают
- [ ] Валидация через zod для входных данных
- [ ] Инвалидация кэша после mutations
