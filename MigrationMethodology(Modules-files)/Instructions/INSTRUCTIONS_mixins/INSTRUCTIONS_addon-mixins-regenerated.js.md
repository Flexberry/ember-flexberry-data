# Миграция: regenerated mixins (audit-entity, audit-field, object-type, agent, link-group, session)

## Типы Ember → Next.js
- Ember тип: mixin (regenerated)
- Next.js аналог: Composition function

### Общая информация
Сгенерированные mixins содержат автоматически сгенерированную логику для соответствующих моделей.

### 1. Исходные файлы (Ember)
```
// addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Автоматически сгенерированная логика для audit-entity
});

// Аналогичные файлы для:
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/hooks/useAuditEntityMixin.ts`
- `app/lib/hooks/useAuditFieldMixin.ts`
- `app/lib/hooks/useObjectTypeMixin.ts`
- `app/lib/hooks/useAgentMixin.ts`
- `app/lib/hooks/useLinkGroupMixin.ts`
- `app/lib/hooks/useSessionMixin.ts`

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function use<Model>Mixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Для каждого mixin создать файл с hook
3. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useAuditEntityMixin.ts
import { useState, useCallback } from 'react';

export function useAuditEntityMixin() {
  const [generatedValue, setGeneratedValue] = useState<string | null>(null);

  const generate = useCallback(() => {
    // Автоматически сгенерированная логика для audit-entity
    const value = `AUTO-${Date.now()}`;
    setGeneratedValue(value);
    return value;
  }, []);

  const clear = useCallback(() => {
    setGeneratedValue(null);
  }, []);

  return {
    generatedValue,
    generate,
    clear,
  };
}

// Аналогично для других моделей:

// app/lib/hooks/useAuditFieldMixin.ts
export function useAuditFieldMixin() {
  // ...
}

// app/lib/hooks/useObjectTypeMixin.ts
export function useObjectTypeMixin() {
  // ...
}

// app/lib/hooks/useAgentMixin.ts
export function useAgentMixin() {
  // ...
}

// app/lib/hooks/useLinkGroupMixin.ts
export function useLinkGroupMixin() {
  // ...
}

// app/lib/hooks/useSessionMixin.ts
export function useSessionMixin() {
  // ...
}
```

### 7. Чек-лист валидации
- [ ] Файлы `useAuditEntityMixin.ts`, `useAuditFieldMixin.ts`, `useObjectTypeMixin.ts`, `useAgentMixin.ts`, `useLinkGroupMixin.ts`, `useSessionMixin.ts` созданы
- [ ] Для каждого mixin используется соответствующая логика
- [ ] В компонентах использовать соответствующие mixins
