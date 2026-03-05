# Модуль: audit-entity-serializer

## Файлы
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
- app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js

## Зависимости (должны быть перенесены ДО этого модуля)
- odata-serializer
- audit-entity-model

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/auditEntitySerializer.ts`

**Пример шаблона:**
```ts
// serializers/auditEntitySerializer.ts
import { ODataSerializer } from './odataSerializer';

export class AuditEntitySerializer extends ODataSerializer {
  // OData-specific serialization
}
```

## Порядок действий при переносе

1. Перенести `odata-serializer`
2. Создать `AuditEntitySerializer` класс

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `odata-serializer` перенесён
- [ ] `AuditEntitySerializer` класс создан

## Примечания

- Ember serializer → TypeScript class
