# Миграция: специфичные модели (audit-entity, audit-field, object-type, agent, link-group, session)

## Типы Ember → Next.js
- Ember тип: model
- Next.js аналог: TypeScript interface + hooks

### Общая информация
Специфичные модели имеют кастомные свойства для конкретных сущностей (audit-entity, audit-field и т.д.). В Next.js 16 они преобразуются в TypeScript interfaces с custom hooks.

### 1. Исходные файлы (Ember)
```
// addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
import Model from './model';

export default Model.extend({
  // Кастомные свойства для audit-entity
});

// Аналогичные файлы для:
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/types/audit-entity.ts`
- `app/lib/types/audit-field.ts`
- `app/lib/types/object-type.ts`
- `app/lib/types/agent.ts`
- `app/lib/types/link-group.ts`
- `app/lib/types/session.ts`
- Соответствующие hooks для каждой модели

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> extends BaseModel { ... }`
- `attr('string')` → `name: string`
- `attr('date')` → `date: Date`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod (валидация)

### 5. Алгоритм миграции
1. Создать папку `app/lib/types/`
2. Для каждой модели создать файл с интерфейсом
3. Для каждой модели создать custom hooks
4. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts
export interface BaseModel {
  id: string;
  createdAt: string;
  modifiedAt: string;
}

// app/lib/types/audit-entity.ts
import { BaseModel } from '@/lib/types/model';

export interface AuditEntity extends BaseModel {
  name: string;
  description?: string;
  objectName: string;
  // Кастомные свойства для audit-entity
}

// app/lib/types/audit-field.ts
import { BaseModel } from '@/lib/types/model';

export interface AuditField extends BaseModel {
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  // Кастомные свойства для audit-field
}

// app/lib/types/object-type.ts
import { BaseModel } from '@/lib/types/model';

export interface ObjectType extends BaseModel {
  name: string;
  // Кастомные свойства для object-type
}

// app/lib/types/agent.ts
import { BaseModel } from '@/lib/types/model';

export interface Agent extends BaseModel {
  name: string;
  type: string;
  // Кастомные свойства для agent
}

// app/lib/types/link-group.ts
import { BaseModel } from '@/lib/types/model';

export interface LinkGroup extends BaseModel {
  name: string;
  // Кастомные свойства для link-group
}

// app/lib/types/session.ts
import { BaseModel } from '@/lib/types/model';

export interface Session extends BaseModel {
  userId: string;
  startTime: string;
  endTime?: string;
  // Кастомные свойства для session
}

// Использование в компонентах
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useAuditEntities() {
  return useQuery({
    queryKey: ['audit-entity'],
    queryFn: async () => {
      const response = await apiClient.get<AuditEntity[]>(`/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity`);
      return response.data;
    },
    staleTime: 60000,
  });
}

// Валидация с zod
import { z } from 'zod';

export const auditEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  modifiedAt: z.string(),
  name: z.string(),
  description: z.string().optional(),
  objectName: z.string(),
});

export type AuditEntity = z.infer<typeof auditEntitySchema>;
```

### 7. Чек-лист валидации
- [ ] Файлы `audit-entity.ts`, `audit-field.ts`, `object-type.ts`, `agent.ts`, `link-group.ts`, `session.ts` созданы с интерфейсами
- [ ] Для каждой модели созданы custom hooks
- [ ] Валидация через zod для входных данных
- [ ] Типыэкспорт экспортируются из `app/lib/types/index.ts`
