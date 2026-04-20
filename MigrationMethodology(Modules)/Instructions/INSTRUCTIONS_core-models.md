# Инструкция: core-models

## Общее_description

Модуль реализует базовые Ember-модели данных (`Model`, `ModelWithoutValidation`, `OfflineModel`), используемые как основа для всех остальных моделей проекта. Они наследуются и расширяются автогенерированными моделями. Также включает поддержку моделей без валидации и в режиме оффлайн.

## Состав модуля (файлы)

### Основные файлы
- `addon/models/model.js`
- `addon/models/model-without-validation.js`
- `addon/models/offline-model.js`

### Дубликаты (app/)
- `app/models/model.js` — дубликат `addon/models/model.js`
- `app/models/model-without-validation.js` — дубликат `addon/models/model-without-validation.js`
- `app/models/offline-model.js` — дубликат `addon/models/offline-model.js`

> 📝 Примечание: Дубликаты `app/` создаются Ember CLI при сборке и **не требуют отдельной миграции**.

## Порядок миграции файлов внутри модуля

1. `model.js` — базовая модель с поддержкой базовых атрибутов и relationship-методов
2. `model-without-validation.js` — модель без валидации Ember Data
3. `offline-model.js` — расширение базовой модели с поддержкой оффлайн-режима

## Особенности реализации

- В модуле используется `ember-data/model`, `DS.attr`, `DS.hasMany`, `DS.belongsTo`
- В `offline-model.js` есть mixin для связи с `DexieService`
- Модели используют computed-свойства (`fullName`, `displayName`, `displayDescription`)
- Все модели поддерживают `toString` и `toJSON`

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember Data model.extend() не работает в Next.js | Используйте TypeScript-интерфейсы + `useQuery`/`useMutation` для работы с данными |
| Computed-свойства (`computed('firstName', function() {...})`) | Замените на `useMemo(() => firstName + ' ' + lastName, [firstName])` |
| Привязка к `this.store.findRecord(...)` | Замените на `useQuery({ queryKey: ['users'], queryFn: () => fetch('/api/users') })` |

---

### Файл: `addon/models/model.js`

#### Тип Ember-модуля
Base Model (Extended from `ember-data/model`)

#### Тип Next.js-модуля
TypeScript Interface + Custom React Query Hooks + Utility Functions

##### 1. Исходный файл (Ember)
`addon/models/model.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/model.ts` + `app/lib/hooks/useModel.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `DS.Model.extend` | `interface Model` |
| `DS.attr('string')` | `name?: string` в интерфейсе |
| `DS.hasMany('model')` | `children?: Model[]` (см. ниже) |
| `DS.belongsTo('model')` | `parent?: string` (ID) или `parent?: Model` (с распределённым запросом) |
| `Computed` свойства | `useMemo` / `useCallback` |
| `this.store.findRecord(...)` | `useQuery` / `useMutation` из `@tanstack/react-query` |
| `this.get('name')` | Прямой доступ: `model.name` |

##### 4. Зависимости (библиотеки)
- `@tanstack/react-query`
- `zod` (для валидации)
- `react`
- `typescript`

##### 5. Алгоритм миграции
1. Создайте TypeScript-интерфейс `BaseModel` в `app/lib/types/model.ts`
2. Импортируйте `useQuery`, `useQueryClient` из `@tanstack/react-query`
3. Создайте кастомный хук `useBaseModel(id)` для получения данных
4. Реализуйте валидацию через `zod`
5. Удалите все `DS.attr`, `DS.hasMany`, `DS.belongsTo` — замените на обычные свойства интерфейса
6. Замените computed-свойства на `useMemo`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts
export interface BaseModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  // Примеры атрибутов (реальные атрибуты добавляются в дочерние модели)
  name?: string;
  description?: string;
}

// app/lib/hooks/useModels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseModel } from '@/lib/types/model';

export const fetchModels = async (): Promise<BaseModel[]> => {
  const res = await fetch('/api/models');
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
};

export const fetchModelById = async (id: string): Promise<BaseModel> => {
  const res = await fetch(`/api/models/${id}`);
  if (!res.ok) throw new Error('Failed to fetch model');
  return res.json();
};

export const createModel = async (data: Omit<BaseModel, 'id' | 'createdAt' | 'updatedAt'>) => {
  const res = await fetch('/api/models', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create model');
  return res.json();
};

export const updateModel = async (id: string, data: Partial<BaseModel>) => {
  const res = await fetch(`/api/models/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update model');
  return res.json();
};

export const deleteModel = async (id: string) => {
  const res = await fetch(`/api/models/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete model');
};

// Хук для получения всех моделей
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
    staleTime: 60_000, // 60 секунд
  });
}

// Хук для получения одной модели
export function useModel(id: string) {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => fetchModelById(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

// Хук для создания модели
export function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['models'] }),
  });
}

// Хук для обновления модели
export function useUpdateModel(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BaseModel>) => updateModel(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['model', id] }),
  });
}

// Хук для удаления модели
export function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteModel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['models'] }),
  });
}
```

##### 7. Чек-лист качества
- [ ] Интерфейс `BaseModel` создан в `app/lib/types/model.ts`
- [ ] Хуks `useModels`, `useModel`, `useCreateModel`, `useUpdateModel`, `useDeleteModel` реализованы
- [ ] Используется `@tanstack/react-query` (не Ember Data)
- [ ] Структура данных — TypeScript, без `DS.attr`
- [ ] API вызовы — `fetch`/`axios` (не `this.store.findRecord`)
- [ ] Валидация — через `zod.schema`
- [ ] Тесты — `vitest` + `@testing-library/react`

---

### Файл: `addon/models/model-without-validation.js`

#### Тип Ember-модуля
Extended Model (без валидации)

#### Тип Next.js-модуля
TypeScript Interface + Custom React Query Hooks (без валидации)

##### 1. Исходный файл (Ember)
`addon/models/model-without-validation.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/model-without-validation.ts` + reuse `app/lib/hooks/useModels.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `DS.Model.extend(Model)` | `interface ModelWithoutValidation extends BaseModel {}` |
| Валидация Ember (`validate') | Удалена — не нужна в Next.js (или кастомная валидация через `zod` на уровне формы) |

##### 4. Зависимости (библиотеки)
- `app/lib/types/model.ts`
- `@tanstack/react-query`
- `zod` (опционально, если нужна кастомная валидация)

##### 5. Алгоритм миграции
1. Создайте `ModelWithoutValidation` интерфейс, наследующий `BaseModel`
2. Убедитесь, что все API вызовы используют `fetchModels()` и т.д.
3. Удалите всё связанное с валидацией (`validate`, `errors`, `validationRules`)
4. Если нужна валидация — реализуйте её через `zod` на уровне компонента или формы

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model-without-validation.ts
import { BaseModel } from './model';

export interface ModelWithoutValidation extends BaseModel {
  // Дополнительные атрибуты для конкретного сценария без валидации
  // Например, загрузка данных "такими как есть"
  rawData?: unknown;
}
```

> 📌 **Важно:** Для типов нет отдельного хука — используются общие хуки из `useModels.ts`

##### 7. Чек-лист качества
- [ ] `ModelWithoutValidation` наследуется от `BaseModel`
- [ ] Нет引用 Ember `validate` или `errors`
- [ ] Используется `useQuery`/`useMutation` (не `this.get('errors')`)
- [ ] Валидация (если нужна) — через `zod` или UI-логику
- [ ] Тесты — `vitest`

---

### Файл: `addon/models/offline-model.js`

#### Тип Ember-модуля
Offline-enabled Model (с поддержкой IndexedDB)

#### Тип Next.js-модуля
TypeScript Interface + Custom React Query Hooks (с локальным хранилищем)

##### 1. Исходный файл (Ember)
`addon/models/offline-model.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/offline-model.ts` + `app/lib/hooks/useOfflineModels.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `OfflineModelMixin` | Расширение `OfflineModel extends BaseModel` |
| `dexieService` | `IndexedDB client` (см. модуль `offline-store`) |
| `save()` → localStorage | `db.table('models').put(data)` |

##### 4. Зависимости (библиотеки)
- `app/lib/types/model.ts`
- `app/lib/hooks/useModels.ts`
- `idb` или `dexie` (если используется IndexedDB в Next.js)
- `@tanstack/react-query`

##### 5. Алгоритм миграции
1. Создайте `OfflineModel extends BaseModel`
2. Используйте `dexie` или `idb` для работы с IndexedDB
3. Реализуйте кастомные хуки `useOfflineModels` с поддержкой кэширования
4. Модель из `offline-model.js` — это расширение `BaseModel`, поэтому просто унаследуйте
5. Для синхронизации используйте `useMutation` с `onMutate` & `onSuccess`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/offline-model.ts
import { BaseModel } from './model';

export interface OfflineModel extends BaseModel {
  // Для оффлайн-режима добавляем метаданные
  isOffline?: boolean;
  offlineData?: Record<string, unknown>;
}
```

> 📌 **Важно:** Реальное чтение/запись IndexedDB — в модуле `offline-store`. Здесь — только типы.

##### 7. Чек-лист качества
- [ ] `OfflineModel` наследуется от `BaseModel`
- [ ] Используется `useQuery`/`useMutation`
- [ ] IndexedDB-чтение — через `dexie`/`idb` (в другом модуле)
- [ ] Данные синхронизируются между онлайн/оффлайн (`onMutate`)
- [ ] Тесты — `vitest` + `msw` (Mock Service Worker)

---

## Итог

Модуль `core-models` мигрирован, если:

✅ Интерфейсы `BaseModel`, `ModelWithoutValidation`, `OfflineModel` созданы  
✅ Хуки `useModels`, `useModel`, `useCreateModel`, `useUpdateModel`, `useDeleteModel` работают  
✅ Ember Data (`DS.Model`, `DS.attr`) удалены  
✅ Используется `@tanstack/react-query`  
✅ TypeScript — типизация на всех уровнях  

--- 

## Следующий модуль (рекомендуемый порядок)

После `core-models` — перейдите к модулю **`utils`** (нет зависимостей — можно мигрировать параллельно), затем **`transforms`**.
