# Модуль: audit-operation-type-transform

## Файлы
- addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
- app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/auditOperationTypeTransform.ts`

**Пример шаблона:**
```ts
// transforms/auditOperationTypeTransform.ts
// Enum values: INSERT, UPDATE, DELETE

export class AuditOperationTypeTransform {
  serialize(value: string | null): string | null {
    return value ? String(value) : null;
  }

  deserialize(value: string | null): string | null {
    return value ? String(value) : null;
  }
}

export const SERIALIZED_INSERT = 'INSERT';
export const SERIALIZED_UPDATE = 'UPDATE';
export const SERIALIZED_DELETE = 'DELETE';

export function serializeAuditOperationType(value: any): string | null {
  return value ? String(value) : null;
}

export function deserializeAuditOperationType(value: any): string | null {
  return value ? String(value) : null;
}
```

## Порядок действий при переносе

1. Создать `AuditOperationTypeTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `AuditOperationTypeTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
- Enum values: INSERT, UPDATE, DELETE
