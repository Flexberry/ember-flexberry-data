# Инструкция: audit

## Общее описание

Модуль содержит модели для ведения аудита действий пользователя: типы операций аудита, варианты выполнения, модель `AuditModel`. Это расширяется встроенной моделью `audit` и `transform` типов аудита.

## Состав модуля (файлы)

### Основной файл
- `addon/mixins/audit-model.js`

### Transforms
- `app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` — дубликат
- `app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` — дубликат

### Дополнительные
- `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`
- `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`
- `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`
- `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`
- `app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` — дубликат
- `app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` — дубликат

> 📝 Примечание: Дубликаты `app/` не требуют отдельной миграции.

## Порядок миграции файлов внутри модуля

1. `audit-model.js` — базовый mixin для аудита
2. `enums/*.js` → TypeScript enum
3. `transforms/*.js` → transform-функции (уже есть в `transforms`)

## Особенности реализации

- Миксин `audit-model.js` добавляет поля `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy`
- `execution-variant`, `type-of-audit-operation` — enum-типы
- `audit-model.js` зависит от `core-models/model.js`

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `Mixin` → Next.js | TypeScript `interface` |
| `DS.attr('string')` | `createdAt?: string` в интерфейсе |
| `Ember.get(this, 'user')` | `user` из `useUser()` |

---

### Файл: `addon/mixins/audit-model.js`

#### Тип Ember-модуля
Model Mixin (adds audit fields)

#### Тип Next.js-модуля
TypeScript Interface + Hook

##### 1. Исходный файл (Ember)
`addon/mixins/audit-model.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/audit-model.ts` + `app/lib/hooks/useAudit.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Mixin.create({})` | `interface AuditModel extends BaseModel` |
| `attr('date')` for createdAt, modifiedAt | `createdAt?: string`, `modifiedAt?: string` |
| `attr('string')` for createdBy, modifiedBy | `createdById?: string`, `modifiedById?: string` |
| `this.get('user')` | `useUser()` from `@/lib/hooks/useUser` |

##### 4. Зависимости
- `@tanstack/react-query`
- `app/lib/types/model.ts`
- `app/lib/hooks/useUser.ts` (из модуля `services`)

##### 5. Алгоритм миграции
1. Удалите `Mixin.create`
2. `AuditModel extends BaseModel`
3. Добавьте поля аудита: `createdAt`, `createdById`, `modifiedAt`, `modifiedById`
4. Хук `useAudit()` для проверки прав

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/audit-model.ts
import { BaseModel } from './model';
import { User } from './user';

export interface AuditModel extends BaseModel {
  createdAt?: string;
  createdById?: string;
  createdBy?: User;
  modifiedAt?: string;
  modifiedById?: string;
  modifiedBy?: User;
}

// app/lib/hooks/useAudit.ts
import { useMemo } from 'react';
import { useUser } from '@/lib/hooks/useUser';

export function useAudit(model: AuditModel | null) {
  const { user: currentUser } = useUser();

  const canEdit = useMemo(() => {
    if (!model || !currentUser) return false;
    // Пример: только создатель может редактировать
    return model.createdById === currentUser.id;
  }, [model, currentUser]);

  return {
    canEdit,
    model,
    currentUser,
  };
}
```

---

### Файл: `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

#### Тип Ember-модуля
Enum

#### Тип Next.js-модуля
TypeScript Enum (уже есть в `transforms`)

##### 1. Исходный файл (Ember)
`addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/enums.ts` (уже создано в `transforms`)

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| Ember.Enum | `AuditOperationType` |

##### 4. Зависимости
- `typescript`

##### 5. Алгоритм миграции
1. Удалите Ember.Enum
2. Используйте уже созданный `AuditOperationType` из `transforms`

##### 6. Пример кода (уже есть в `transforms`)
```typescript
// app/lib/types/enums.ts
export enum AuditOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
}
```

##### 7. Чек-лист качества
- [ ] Используется `AuditOperationType` из `transforms`
- [ ] Нет Ember.Enum
- [ ] Тесты — `vitest`

---

### Файл: `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`

#### Тип Ember-модуля
Enum

#### Тип Next.js-модуля
TypeScript Enum (уже есть в `transforms`)

##### 1. Исходный файл (Ember)
`addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/enums.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| Ember.Enum | `ExecutionVariant` |

##### 4. Зависимости
- `typescript`

##### 5. Алгоритм миграции
1. Удалите Ember.Enum
2. Используйте `ExecutionVariant` из `transforms`

##### 6. Пример кода (уже есть в `transforms`)
```typescript
// app/lib/types/enums.ts
export enum ExecutionVariant {
  SYNCHRONOUS = 'SYNCHRONOUS',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  BATCH = 'BATCH',
}
```

---

### Файл: `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

#### Тип Ember-модуля
Transform (AuditOperationType)

#### Тип Next.js-модуля
Transform (уже есть в `transforms`)

##### 1. Исходный файл (Ember)
`addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/audit-oper.ts` (уже создано в `transforms`)

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `serialize`, `deserialize` | `serializeAuditOperation`, `deserializeAuditOperation` |

##### 4. Зависимости
- `app/lib/transforms/enum.ts`
- `app/lib/types/enums.ts`

##### 5. Алгоритм миграции
1. Удалите Ember `DS.Transform`
2. Используйте `serializeEnum`/`deserializeEnum`

##### 6. Пример кода (уже есть в `transforms`)
```typescript
// app/lib/transforms/audit-oper.ts
import { serializeEnum, deserializeEnum } from '@/lib/transforms/enum';
import { AuditOperationType } from '@/lib/types/enums';

export function serializeAuditOperation(value: string | number | null): string | number | null {
  return serializeEnum(value, AuditOperationType);
}

export function deserializeAuditOperation(value: string | number | null): string | number | null {
  return deserializeEnum(value, AuditOperationType);
}
```

---

## Итог

Модуль `audit` мигрирован, если:

✅ `AuditModel extends BaseModel` с полями аудита  
✅ `AuditOperationType` и `ExecutionVariant` — TypeScript enum  
✅ `serializeAuditOperation` и `deserializeAuditOperation` используют `enum.ts`  
✅ `useAudit()` — hook для проверки прав  

## Следующий модуль (рекомендуемый порядок)

После `audit` — перейдите к **`offline`**, так как он зависит от `core-models`, `offline-store`, и `utils`.
