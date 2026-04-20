# Миграция: addon/models/model-without-validation.js

## Тип Ember → Next.js
- Ember тип: model (without validation)
- Next.js аналог: TypeScript interface + hooks (without validation)

### 1. Исходный файл (Ember)
```
// addon/models/model-without-validation.js
import Model from './offline-model';

export default Model.extend({
  // Модель без валидации
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/types/model-without-validation.ts` — TypeScript interface
- `app/lib/hooks/useModelWithoutValidationQuery.ts` — custom hooks

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> extends OfflineModel { ... }`
- Наследование → extends в TypeScript

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod

### 5. Алгоритм миграции
1. Создать папку `app/lib/types/`
2. Создать файл `model-without-validation.ts` с интерфейсом, extends OfflineModel
3. Создать custom hooks `useModelWithoutValidationQuery.ts`
4. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model-without-validation.ts
import { OfflineModel } from '@/lib/types/offline-model';

export interface ModelWithoutValidation extends OfflineModel {
  // Модель без валидации
  // Дополнительные свойства без zod-валидации
}

// app/lib/hooks/useModelWithoutValidationQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useModelWithoutValidationQuery<T extends ModelWithoutValidation>(modelName: string) {
  return useQuery({
    queryKey: [modelName],
    queryFn: async () => {
      const response = await apiClient.get<T[]>(`/${modelName}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

export function useModelWithinValidationByIdQuery<T extends ModelWithoutValidation>(modelName: string, id: string | number) {
  return useQuery({
    queryKey: [modelName, id],
    queryFn: async () => {
      const response = await apiClient.get<T>(`/${modelName}(${id})`);
      return response.data;
    },
    staleTime: 60000,
  });
}

export function useCreateModelWithoutValidationRecord<T extends ModelWithoutValidation>() {
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

export function useUpdateModelWithoutValidationRecord<T extends ModelWithoutValidation>() {
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

export function useDeleteModelWithoutValidationRecord() {
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
- [ ] Файл `app/lib/types/model-without-validation.ts` создан с интерфейсом, extends OfflineModel
- [ ] Файлы `useModelWithoutValidationQuery.ts`, `useModelWithinValidationByIdQuery.ts`, `useCreateModelWithoutValidationRecord.ts`, `useUpdateModelWithoutValidationRecord.ts`, `useDeleteModelWithoutValidationRecord.ts` созданы
- [ ] Все CRUD operations работают без валидации
