# Модуль: audit-object-type-serializer

## Файлы
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
- app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js

## Зависимости (должны быть перенесены ДО этого модуля)
- odata-serializer
- audit-object-type-model

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/objectTypeSerializer.ts`

**Пример шаблона:**
```ts
// serializers/objectTypeSerializer.ts
import { ODataSerializer } from './odataSerializer';

export class ObjectTypeSerializer extends ODataSerializer {
  // OData-specific serialization
}
```

## Порядок действий при переносе

1. Перенести `odata-serializer`
2. Создать `ObjectTypeSerializer` класс

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `odata-serializer` перенесён
- [ ] `ObjectTypeSerializer` класс создан

## Примечания

- Ember serializer → TypeScript class
