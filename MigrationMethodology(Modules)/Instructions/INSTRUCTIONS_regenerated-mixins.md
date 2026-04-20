# Инструкция: regenerated-mixins

## Общее описание

Модуль содержит автогенерированные миксины для моделей и сериализаторов. Эти миксины добавляют динамические атрибуты и проекции во время генерации. В Next.js миксин-подход заменяется на TypeScript-расширения интерфейсов или композицию функций.

## Состав модуля (файлы)

### Миксины для моделей
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`
- `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

### Миксины для сериализаторов
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js`
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js`
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js`
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js`
- `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js`

## Порядок миграции файлов внутри модуля

1. `models/...` — миксины для моделей → TypeScript interfaces
2. `serializers/...` — миксины для сериализаторов → функции сериализации

## Особенности реализации

- Ember-миксины (`Ember.Mixin.create`) добавляют атрибуты во время генерации
- `attributes` и `projection` — динамически добавляются миксинами
- В Next.js — используйте TypeScript `type` + `interface` и наследование/композицию

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `Mixin.create` | TypeScript `interface extends A, B` или `typeMixin(...)` (composition pattern) |
| Динамические атрибуты (`this.get('attributes')`) | Заранее определить interface или использовать `Record<string, any>` |
| `Ember.get`
| `Ember.set` | Прямой доступ `obj.field` или `obj['field-name']` |

---

### Файл: `addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

#### Тип Ember-модуля
Model Mixin (adds `attributes`, `projection`)

#### Тип Next.js-модуля
TypeScript Interface + Type Guard + Serializer Helper

##### 1. Исходный файл (Ember)
`addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/types/models/security-agent-mixin.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Mixin.create({ attributes: {}, projection: '...' })` | `interface SecurityAgentMixin extends BaseMixin {}` |
| `Ember.get(this, 'attributes')` | `obj.attributes` |
| `Ember.get(this, 'projection')` | `obj.projection` |

##### 4. Зависимости
- `app/lib/types/models/security-agent.ts`
- `typescript`

##### 5. Алгоритм миграции
1. Удалите Ember `Ember.Mixin.create`
2. Создайте `interface SecurityAgentMixin`
3. Используйте наследование или `type` для объединения
4. Для сериализации — кастомные функции

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/models/security-agent-mixin.ts
import { BaseModel } from '../model';

export interface SecurityAgentMixin {
  attributes?: Record<string, any>;
  projection?: string;
  // Дополнительные динамические атрибуты (если известны)
  dynamicField1?: any;
  dynamicField2?: any;
}

// Пример: объединение интерфейсов (composable)
export type SecurityAgentFull = SecurityAgentMixin & {
  // статические атрибуты из BaseModel и SecurityAgent
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  linkGroupIds?: string[];
  sessionId?: string;
};

/**
 * Проверяет, что объект содержит атрибуты
 */
export function hasAttributes(obj: any): obj is SecurityAgentMixin {
  return obj && typeof obj === 'object' && typeof obj.attributes === 'object';
}

/**
 * Сериализует mixin для отправки в API
 */
export function serializeSecurityAgentMixin(
  data: SecurityAgentMixin
): Record<string, any> {
  const { attributes, projection, ...rest } = data;
  return {
    ...rest,
    ...(attributes && { attributes: JSON.stringify(attributes) }),
    projection,
  };
}

/**
 * Десериализует mixin из API
 */
export function deserializeSecurityAgentMixin(
  data: Record<string, any>
): SecurityAgentMixin {
  const { attributes, projection, ...rest } = data;
  return {
    ...rest,
    ...(attributes && { attributes: JSON.parse(attributes) }),
    projection,
  };
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `Mixin.create`
- [ ] TypeScript `interface` и `type`
- [ ] `serializeSecurityAgentMixin`, `deserializeSecurityAgentMixin`
- [ ] `hasAttributes` — type guard
- [ ] Тесты — `vitest`

---

### Файл: `addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

#### Тип Ember-модуля
Serializer Mixin (for `serialize`, `normalizeResponse`)

#### Тип Next.js-модуля
Helper Functions (for `serialize`/`deserialize`)

##### 1. Исходный файл (Ember)
`addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/serializers/security-agent.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `SerializerMixin.create({ serialize, normalizeResponse })` | `function serializeSecurityAgent(...)` |
| `DS.Serializer` methods | `function deserializeSecurityAgent(...)` |

##### 4. Зависимости
- `app/lib/types/models/security-agent-mixin.ts`
- `typescript`

##### 5. Алгоритм миграции
1. Удалите `SerializerMixin.create`
2. Создайте `serializeSecurityAgent(data)`
3. Создайте `deserializeSecurityAgent(data)`
4. Вызовите `serializeSecurityAgentMixin` / `deserializeSecurityAgentMixin`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/serializers/security-agent.ts
import { SecurityAgentMixin, serializeSecurityAgentMixin, deserializeSecurityAgentMixin } from '@/lib/types/models/security-agent-mixin';

export function serializeSecurityAgent(data: SecurityAgentMixin): Record<string, any> {
  return serializeSecurityAgentMixin(data);
}

export function deserializeSecurityAgent(data: Record<string, any>): SecurityAgentMixin {
  return deserializeSecurityAgentMixin(data);
}

/**
 * Интегрированная сериализация для массива
 */
export function serializeSecurityAgents(data: SecurityAgentMixin[]): Record<string, any>[] {
  return data.map(serializeSecurityAgent);
}

/**
 * Интегрированная десериализация для массива
 */
export function deserializeSecurityAgents(data: Record<string, any>[]): SecurityAgentMixin[] {
  return data.map(deserializeSecurityAgent);
}
```

---

## Для остальных модулей миксинов

Следуйте той же схеме:  
1. `models/...` → `...-mixin.ts` (interface + serializer/deserializer)  
2. `serializers/...` → `...-serializer.ts` (функции сериализации)  

| Ember-модуль | Next.js-модуль |
|--------------|----------------|
| `models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js` | `types/models/security-link-group-mixin.ts` |
| `serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js` | `serializers/security-link-group.ts` |
| `models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js` | `types/models/security-session-mixin.ts` |
| `serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js` | `serializers/security-session.ts` |
| `models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js` | `types/models/audit-entity-mixin.ts` |
| `serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js` | `serializers/audit-entity.ts` |
| ... | ... |

---

## Итог

Модуль `regenerated-mixins` мигрирован, если:

✅ Ember `Mixin.create` — заменён на TypeScript `interface`  
✅ Миксины-моделей → `...-mixin.ts` + `serialize...Mixin`  
✅ Миксины-сериализаторов → `...-serializer.ts`  
✅ Используется наследование/композиция интерфейсов  
✅ Нет Ember `get`/`set`  

## Следующий модуль (рекомендуемый порядок)

После `regenerated-mixins` — перейдите к **`audit`**, так как он зависит от `transforms` и `core-models`.
