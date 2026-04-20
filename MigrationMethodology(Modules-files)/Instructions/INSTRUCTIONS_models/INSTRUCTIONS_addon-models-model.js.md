# Миграция: addon/models/model.js

## Тип Ember → Next.js
- Ember тип: model
- Next.js аналог: TypeScript interface + hooks

### 1. Исходный файл (Ember)
```
// addon/models/model.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  id: attr('string'),
  createdAt: attr('date'),
  modifiedAt: attr('date'),
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/types/model.ts` — TypeScript interface
- `app/lib/hooks/useBaseQuery.ts` — custom hooks

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> { ... }`
- `attr('string')` → `name: string`
- `attr('date')` → `date: Date`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod (валидация)

### 5. Алгоритм миграции
1. Создать папку `app/lib/types/`
2. Создать файл `model.ts` с TypeScript interface
3. Создать custom hooks `useBaseQuery.ts` для базовых методов
4. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts
export interface BaseModel {
  id: string;
  createdAt: string;
  modifiedAt: string;
}

// app/lib/hooks/useBaseQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useBaseQuery<T extends BaseModel>(modelName: string) {
  return useQuery({
    queryKey: [modelName],
    queryFn: async () => {
      const response = await apiClient.get<T[]>(`/${modelName}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

export function useBaseByIdQuery<T extends BaseModel>(modelName: string, id: string | number) {
  return useQuery({
    queryKey: [modelName, id],
    queryFn: async () => {
      const response = await apiClient.get<T>(`/${modelName}(${id})`);
      return response.data;
    },
    staleTime: 60000,
  });
}

export function useCreateBaseRecord<T extends BaseModel>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, data }: { modelName: string; data: Omit<T, 'id'> }) => {
      const response = await apiClient.post<T>(`/${modelName}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.modelName] });
    },
  });
}

export function useUpdateBaseRecord<T extends BaseModel>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id, data }: { modelName: string; id: string | number; data: Partial<T> }) => {
      const response = await apiClient.patch<T>(`/${modelName}(${id})`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: [variables.modelName] });
    },
  });
}

export function useDeleteBaseRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelName, id }: { modelName: string; id: string | number }) => {
      await apiClient.delete(`/${modelName}(${id})`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.modelName, variables.id] });
      queryClient.invalidateQueries({ queryKey: [variables.modelName] });
    },
  });
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/types/model.ts` создан с интерфейсом `BaseModel`
- [ ] Файлы `useBaseQuery.ts`, `useBaseByIdQuery.ts`, `useCreateBaseRecord.ts`, `useUpdateBaseRecord.ts`, `useDeleteBaseRecord.ts` созданы
- [ ] Все CRUD operations работают
- [ ] Валидация через zod для входных данных
