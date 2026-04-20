# Модуль: offline-serializer

## Файлы
- addon/serializers/offline.js
- app/serializers/offline.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-serializer

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/offlineSerializer.ts`

**Пример шаблона:**
```ts
// serializers/offlineSerializer.ts
import { BaseSerializer } from './baseSerializer';

export class OfflineSerializer extends BaseSerializer {
  serialize(snapshot: any): any {
    const payload = super.serialize(snapshot);
    // ... offline-specific serialization
    return payload;
  }

  normalizeResponse(store: any, primaryModelClass: any, payload: any, id: string, requestType: string): any {
    const normalized = super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    // ... offline-specific normalization
    return normalized;
  }

  // Handle local-only attributes
  serializeAttribute(snapshot: any, json: any, key: string, attributes: any): any {
    // ... attribute serialization logic
  }

  // Handle local relationships
  serializeRelationship(record: any, json: any, key: string, relationship: any): any {
    // ... relationship serialization logic
  }
}
```

## Порядок действий при переносе

1. Перенести `base-serializer`
2. Создать `OfflineSerializer` класс
3. Переопределить методы из base-serializer
4. Обработать local-only attributes

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `base-serializer` перенесён
- [ ] `OfflineSerializer` класс создан
- [ ] Методы переопределены
- [ ] local-only attributes handled
- [ ] Тесты переписаны

## Примечания

- Наследование от base-serializer
- Дополнительная логика для offline state
