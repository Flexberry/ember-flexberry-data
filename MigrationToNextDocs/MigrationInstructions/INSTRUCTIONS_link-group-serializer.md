# Модуль: link-group-serializer

## Файлы
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
- app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js

## Зависимости (должны быть перенесены ДО этого модуля)
- odata-serializer
- link-group-model

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/linkGroupSerializer.ts`

**Пример шаблона:**
```ts
// serializers/linkGroupSerializer.ts
import { ODataSerializer } from './odataSerializer';

export class LinkGroupSerializer extends ODataSerializer {
  // OData-specific serialization
}
```

## Порядок действий при переносе

1. Перенести `odata-serializer`
2. Создать `LinkGroupSerializer` класс

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `odata-serializer` перенесён
- [ ] `LinkGroupSerializer` класс создан

## Примечания

- Ember serializer → TypeScript class
