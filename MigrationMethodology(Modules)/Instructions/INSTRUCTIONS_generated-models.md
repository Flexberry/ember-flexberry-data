# Инструкция: generated-models

## Общее описание

Модуль содержит автогенерированные модели для бизнес-сущностей: безопасности (`SecurityAgent`, `SecurityLinkGroup`, `SecuritySession`), аудита (`AuditEntity`, `AuditField`, `ObjectType`). Это расширения `Model` из `core-models`, добавляющие специфические для бизнес-логики атрибуты и связи.

## Состав модуля (файлы)

### Модели
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`
- `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

### Дубликаты (app/)
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

> 📝 Примечание: Дубликаты `app/` не требуют отдельной миграции.

## Порядок миграции файлов внутри модуля

1. `i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
2. `i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`
3. `i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`
4. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`
5. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`
6. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

## Особенности реализации

- Модели наследуются от `model.js` (в `core-models`)
- Используют `DS.attr('string')`, `DS.hasMany`, `DS.belongsTo`
- Типы данных: ` DS.attr('string')`, `DS.attr('number')`, `DS.attr('date')`, `DS.attr('boolean')`
- Есть связи: `agents`, `linkGroups`, `sessions`, `auditEntities`, `objectTypes`, `auditFields`

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Наследование от `ember-data/model` | Используйте `extends BaseModel` и TypeScript-интерфейсы |
| `DS.hasMany('model')` | `children?: Model[]` (с расширенным запросом) или `childrenIds?: string[]` |
| `DS.belongsTo('model')` | `parent?: string` (ID) или `parent?: Model` (с расширенным запросом) |

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

#### Тип Ember-модуля
Model (extends `core-models/model.js`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/security-agent.ts` + `app/lib/hooks/useSecurityAgents.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Model.extend(BaseModel)` | `SecurityAgent extends BaseModel` |
| `attr('string')` | `name?: string` в TypeScript |
| `hasMany('security-link-group')` | `linkGroups?: SecurityLinkGroup[]` (расширенный запрос) |
| `belongsTo('security-session')` | `session?: string` (ID) |

##### 4. Зависимости
- `@tanstack/react-query`
- `app/lib/types/model.ts`
- `app/lib/types/models/security-link-group.ts`
- `app/lib/types/models/security-session.ts`

##### 5. Алгоритм миграции
1. Удалите Ember `Model.extend`
2. Создайте `SecurityAgent extends BaseModel`
3. Уберите `DS.hasMany('...')` → заменить на `linkGroupsIds?: string[]` (или `linkGroups?: SecurityLinkGroup[]` с `useQuery`)
4. Уберите `DS.belongsTo('...')` → заменить на `sessionId?: string`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/security-agent.ts
import { BaseModel } from '../model';
import { SecurityLinkGroup } from './security-link-group';
import { SecuritySession } from './security-session';

export interface SecurityAgent extends BaseModel {
  name?: string;
  description?: string;
  isActive?: boolean;
  linkGroups?: SecurityLinkGroup[];
  linkGroupIds?: string[];
  session?: SecuritySession;
  sessionId?: string;
}

// app/lib/hooks/useSecurityAgents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SecurityAgent } from '@/lib/types/models/security-agent';

const fetchSecurityAgents = async (): Promise<SecurityAgent[]> => {
  const res = await fetch('/api/security-agents');
  if (!res.ok) throw new Error('Failed to fetch security agents');
  return res.json();
};

const fetchSecurityAgentById = async (id: string): Promise<SecurityAgent> => {
  const res = await fetch(`/api/security-agents/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch security agent ${id}`);
  return res.json();
};

export const createSecurityAgent = async (data: Omit<SecurityAgent, 'id' | 'createdAt'>) => {
  const res = await fetch('/api/security-agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create security agent');
  return res.json();
};

export const updateSecurityAgent = async (id: string, data: Partial<SecurityAgent>) => {
  const res = await fetch(`/api/security-agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update security agent ${id}`);
  return res.json();
};

export const deleteSecurityAgent = async (id: string) => {
  const res = await fetch(`/api/security-agents/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete security agent ${id}`);
};

export function useSecurityAgents() {
  return useQuery({
    queryKey: ['security-agents'],
    queryFn: fetchSecurityAgents,
    staleTime: 60_000,
  });
}

export function useSecurityAgent(id: string) {
  return useQuery({
    queryKey: ['security-agent', id],
    queryFn: () => fetchSecurityAgentById(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateSecurityAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSecurityAgent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['security-agents'] }),
  });
}

export function useUpdateSecurityAgent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SecurityAgent>) => updateSecurityAgent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['security-agent', id] }),
  });
}

export function useDeleteSecurityAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSecurityAgent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['security-agents'] }),
  });
}
```

##### 7. Чек-лист качества
- [ ] `SecurityAgent extends BaseModel`
- [ ] No Ember `DS.attr`, `DS.hasMany`, `DS.belongsTo`
- [ ] TypeScript-интерфейс и хуки использованы
- [ ] API вызовы — `fetch` (не `this.store.findRecord`)
- [ ] Тесты — `vitest` + `msw`

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`

#### Тип Ember-модуля
Model (extends `model.js`, зависит от `security-agent.js`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/security-link-group.ts` + `app/lib/hooks/useSecurityLinkGroups.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `hasMany('security-agent')` | `agents?: SecurityAgent[]` / `agentIds?: string[]` |
| `belongsTo('security-agent')` | `agentId?: string` |

##### 4. Зависимости
- `app/lib/types/models/security-agent.ts`
- `app/lib/types/models/security-session.ts`

##### 5. Алгоритм миграции
1. Удалите `Model.extend`
2. `SecurityLinkGroup extends BaseModel`
3. `agentIds?: string[]`, `sessionId?: string`
4. Хуки — аналогично `security-agent`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/security-link-group.ts
import { BaseModel } from '../model';
import { SecurityAgent } from './security-agent';
import { SecuritySession } from './security-session';

export interface SecurityLinkGroup extends BaseModel {
  name?: string;
  description?: string;
  agents?: SecurityAgent[];
  agentIds?: string[];
  session?: SecuritySession;
  sessionId?: string;
}
```

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`

#### Тип Ember-модуля
Model (extends `model.js`, зависит от `security-link-group.js`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/security-session.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `hasMany('security-link-group')` | `linkGroups?: SecurityLinkGroup[]` / `linkGroupIds?: string[]` |

##### 4. Зависимости
- `app/lib/types/models/security-link-group.ts`
- `app/lib/types/models/security-agent.ts`

##### 5. Алгоритм миграции
1. `SecuritySession extends BaseModel`
2. `linkGroupIds?: string[]`
3. Хуки

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/security-session.ts
import { BaseModel } from '../model';
import { SecurityLinkGroup } from './security-link-group';
import { SecurityAgent } from './security-agent';

export interface SecuritySession extends BaseModel {
  isActive?: boolean;
  startTime?: string;
  endTime?: string;
  linkGroups?: SecurityLinkGroup[];
  linkGroupIds?: string[];
  agents?: SecurityAgent[];
  agentIds?: string[];
}
```

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`

#### Тип Ember-модуля
Model (extends `audit-model.js`, зависит от `core-models` и `audit`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/audit-entity.ts` + `app/lib/hooks/useAuditEntities.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `attr('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation')` | `type: AuditOperationType` (enum) |
| `attr('string')` | `name?: string` |

##### 4. Зависимости
- `app/lib/types/models/model.ts`
- `app/lib/transforms/audit-oper.ts`
- `app/lib/types/enums.ts`

##### 5. Алгоритм миграции
1. `AuditEntity extends BaseModel`
2. `type?: AuditOperationType`
3. `name?: string`
4. Хуки

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/audit-entity.ts
import { BaseModel } from '../model';
import { AuditOperationType } from '@/lib/types/enums';

export interface AuditEntity extends BaseModel {
  name?: string;
  description?: string;
  type?: AuditOperationType;
}
```

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`

#### Тип Ember-модуля
Model (extends `audit-model.js`, зависит от `audit`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/audit-field.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `attr('string')`, `attr('number')`, `attr('date')`, `attr('boolean')` | `oldValue?: any`, `newValue?: any` |
| `belongsTo('audit-entity')` | `auditEntityId?: string` |

##### 4. Зависимости
- `app/lib/types/models/model.ts`
- `app/lib/types/models/audit-entity.ts`

##### 5. Алгоритм миграции
1. `AuditField extends BaseModel`
2. `oldValue?: any`, `newValue?: any`, `fieldName?: string`
3. `auditEntityId?: string`
4. Хуки

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/audit-field.ts
import { BaseModel } from '../model';
import { AuditEntity } from './audit-entity';

export interface AuditField extends BaseModel {
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  auditEntity?: AuditEntity;
  auditEntityId?: string;
}
```

---

### Файл: `addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

#### Тип Ember-модуля
Model (extends `audit-model.js`, зависит от `audit`)

#### Тип Next.js-модуля
TypeScript Interface + API Hook

##### 1. Исходный файл (Ember)
`addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/object-type.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `attr('string')` | `name?: string`, `className?: string` |

##### 4. Зависимости
- `app/lib/types/models/model.ts`

##### 5. Алгоритм миграции
1. `ObjectType extends BaseModel`
2. `name?: string`, `className?: string`
3. Хуки

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/object-type.ts
import { BaseModel } from '../model';

export interface ObjectType extends BaseModel {
  name?: string;
  className?: string;
}
```

---

## Итог

Модуль `generated-models` мигрирован, если:

✅ `SecurityAgent`, `SecurityLinkGroup`, `SecuritySession` — наследуются от `BaseModel`  
✅ `AuditEntity`, `AuditField`, `ObjectType` — наследуются от `BaseModel`  
✅ TypeScript enum (`AuditOperationType`, `ExecutionVariant`) используется  
✅ Все API — через `useQuery`/`useMutation`  
✅ No Ember `DS.attr`, `DS.hasMany`, `DS.belongsTo`  

## Следующий модуль (рекомендуемый порядок)

После `generated-models` — перейдите к **`regenerated-mixins`**, так как он зависит от `generated-models` и `core-models`.
