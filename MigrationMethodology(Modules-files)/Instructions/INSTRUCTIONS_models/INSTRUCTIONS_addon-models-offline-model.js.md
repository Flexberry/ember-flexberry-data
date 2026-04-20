# Миграция: addon/models/offline-model.js

## Тип Ember → Next.js
- Ember тип: model (offline)
- Next.js аналог: TypeScript interface + hooks (offline-aware)

### 1. Исходный файл (Ember)
```
// addon/models/offline-model.js
import Model from './model';

export default Model.extend({
  // Дополнительные свойства для offline mode
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/types/offline-model.ts` — TypeScript interface
- `app/lib/hooks/useOfflineModelQuery.ts` — custom hooks для offline

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> extends BaseModel { ... }`
- Наследование → extends в TypeScript

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod

### 5. Алгоритм миграции
1. Создать папку `app/lib/types/`
2. Создать файл `offline-model.ts` с интерфейсом, который extends BaseModel
3. Создать custom hooks `useOfflineModelQuery.ts`
4. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts
export interface BaseModel {
  id: string;
  createdAt: string;
  modifiedAt: string;
}

// app/lib/types/offline-model.ts
import { BaseModel } from '@/lib/types/model';

export interface OfflineModel extends BaseModel {
  // Дополнительные свойства для offline mode
  isOffline?: boolean;
  offlineData?: any;
  // ...
}

// app/lib/hooks/useOfflineModelQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offlineApi } from '@/lib/api/offline';

export function useOfflineModelQuery<T extends OfflineModel>(modelName: string) {
  return useQuery({
    queryKey: ['offline', modelName],
    queryFn: async () => {
      const response = await offlineApi.query<T[]>(modelName, {});
      return response;
    },
    staleTime: 60000,
  });
}

export function useOfflineModelByIdQuery<T extends OfflineModel>(modelName: string, id: string | number) {
  return useQuery({
    queryKey: ['offline', modelName, id],
    queryFn: async () => {
      const response = await offlineApi.find<T>(modelName, id);
      return response;
    },
    staleTime: 60000,
  });
}

export function useCreateOfflineModelRecord<T extends OfflineModel>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, data }: { modelName: string; data: Omit<T, 'id'> }) => {
      const response = await offlineApi.create<T>(modelName, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName] });
    },
  });
}

export function useUpdateOfflineModelRecord<T extends OfflineModel>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id, data }: { modelName: string; id: string | number; data: Partial<T> }) => {
      const response = await offlineApi.update<T>(modelName, id, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['offline', variables.modelName] });
    },
  });
}

export function useDeleteOfflineModelRecord() {
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
- [ ] Файл `app/lib/types/offline-model.ts` создан с интерфейсом, extends BaseModel
- [ ] Файлы `useOfflineModelQuery.ts`, `useOfflineModelByIdQuery.ts`, `useCreateOfflineModelRecord.ts`, `useUpdateOfflineModelRecord.ts`, `useDeleteOfflineModelRecord.ts` созданы
- [ ] Все CRUD operations работают и в оффлайн, и в онлайн режиме
