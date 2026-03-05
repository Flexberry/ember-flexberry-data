# Модуль: audit-execution-variant-transform

## Файлы
- addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/auditExecutionVariantTransform.ts`

**Пример шаблона:**
```ts
// transforms/auditExecutionVariantTransform.ts
// Enum values: NotExecuted, Executed, Error, Failed

export class AuditExecutionVariantTransform {
  serialize(value: string | null): string | null {
    return value ? String(value) : null;
  }

  deserialize(value: string | null): string | null {
    return value ? String(value) : null;
  }
}

export const NOT_EXECUTED = 'Не выполнено';
export const EXECUTED = 'Выполнено';
export const ERROR = 'Ошибка';
export const FAILED = 'Ошибка';

export function serializeAuditExecutionVariant(value: any): string | null {
  return value ? String(value) : null;
}

export function deserializeAuditExecutionVariant(value: any): string | null {
  return value ? String(value) : null;
}
```

## Порядок действий при переносе

1. Создать `AuditExecutionVariantTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `AuditExecutionVariantTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
- Enum values: Не выполнено, Выполнено, Ошибка
