# Модуль: enums

## Файлы
- addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
- app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 enums)

## Рекомендации по переносу

### Enums → TypeScript Constants or Enums

**Ember:** `app/enums/*.js` → **Next.js:** `src/enums/*.ts`

**Пример шаблона:**
```ts
// enums/auditExecutionVariant.ts
// Выполнено, Не выполнено, Ошибка

export const AUDIT_EXECUTION_VARIANT = {
  NOT_EXECUTED: 'Не выполнено',
  EXECUTED: 'Выполнено',
  ERROR: 'Ошибка'
} as const;

export type AuditExecutionVariant = keyof typeof AUDIT_EXECUTION_VARIANT;

// enums/auditOperationType.ts
// INSERT, UPDATE, DELETE

export const AUDIT_OPERATION_TYPE = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
} as const;

export type AuditOperationType = keyof typeof AUDIT_OPERATION_TYPE;
```

## Порядок действий при переносе

1. Создать файлы `auditExecutionVariant.ts` и `auditOperationType.ts`
2. Implement enums as TypeScript constants
3. Export types

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `auditExecutionVariant.ts` создан
- [ ] `auditOperationType.ts` создан
- [ ] Types exported
- [ ] Тесты переписаны

## Примечания

- Ember enums → TypeScript constants
- Использовать `as const` для readonly
