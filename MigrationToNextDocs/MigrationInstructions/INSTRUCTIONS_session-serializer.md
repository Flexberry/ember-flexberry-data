# Модуль: session-serializer

## Файлы
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
- app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js

## Зависимости (должны быть перенесены ДО этого модуля)
- odata-serializer
- session-model

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/sessionSerializer.ts`

**Пример шаблона:**
```ts
// serializers/sessionSerializer.ts
import { ODataSerializer } from './odataSerializer';

export class SessionSerializer extends ODataSerializer {
  modelNameFromPayloadKey(key: string): string {
    // OData-specific mapping
    return super.modelNameFromPayloadKey(key);
  }

  payloadKeyFromModelName(modelName: string): string {
    // OData-specific mapping
    return super.payloadKeyFromModelName(modelName);
  }

  serialize(snapshot: any): any {
    const payload = super.serialize(snapshot);
    // Session-specific serialization
    return payload;
  }

  normalizeResponse(store: any, primaryModelClass: any, payload: any, id: string, requestType: string): any {
    const normalized = super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    // Session-specific normalization
    return normalized;
  }
}
```

## Порядок действий при переносе

1. Перенести `odata-serializer`
2. Создать `SessionSerializer` класс
3. Переопределить методы

## Оценка трудозатрат

≈ 2-3 часа (low)

## Чек-лист для разработчика

- [ ] `odata-serializer` перенесён
- [ ] `SessionSerializer` класс создан
- [ ] Тесты переписаны

## Примечания

- Ember serializer → TypeScript class
