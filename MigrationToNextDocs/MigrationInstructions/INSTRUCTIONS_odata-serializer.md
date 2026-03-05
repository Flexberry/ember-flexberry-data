# Модуль: odata-serializer

## Файлы
- addon/serializers/odata.js
- app/serializers/odata.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-serializer
- string-functions-utils

## Рекомендации по переносу

### Serializer → Extended Serializer with OData Support

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/odataSerializer.ts`

**Пример шаблона:**
```ts
// serializers/odataSerializer.ts
import { BaseSerializer } from './baseSerializer';
import { camelize, underscore } from '../utils/stringFunctions';

export class ODataSerializer extends BaseSerializer {
  modelNameFromPayloadKey(key: string): string {
    // OData-specific: dasherize -> classify
    return camelize(underscore(key));
  }

  payloadKeyFromModelName(modelName: string): string {
    // OData-specific: classify -> dasherize
    return underscore(camelize(modelName));
  }

  serialize(snapshot: any): any {
    const payload = super.serialize(snapshot);
    // OData-specific serialization
    return this.toODataFormat(payload);
  }

  normalizeResponse(store: any, primaryModelClass: any, payload: any, id: string, requestType: string): any {
    const normalized = super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    // OData-specific normalization
    return this.fromODataFormat(normalized);
  }

  // Handle OData @odata.bind syntax
  serializeBelongsTo(snapshot: any, json: any, relationship: any): any {
    const key = relationship.key;
    const belongsTo = snapshot.belongsTo(key);
    
    if (belongsTo && belongsTo.id) {
      json[`${key}@odata.bind`] = `/${this.modelNameFromPayloadKey(relationship.type)}`;
    }
  }

  toODataFormat(payload: any): any {
    // ... convert to OData format
    return payload;
  }

  fromODataFormat(payload: any): any {
    // ... convert from OData format
    return payload;
  }
}
```

## Порядок действий при переносе

1. Перенести `base-serializer` и `string-functions-utils`
2. Создать `ODataSerializer` класс
3. Переопределить `modelNameFromPayloadKey` и `payloadKeyFromModelName`
4. Реализовать OData format conversion
5. Обработать `@odata.bind` syntax

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `base-serializer` перенесён
- [ ] `string-functions-utils` перенесён
- [ ] `ODataSerializer` класс создан
- [ ] OData format conversion
- [ ] `@odata.bind` support
- [ ] Тесты переписаны

## Примечания

- OData v2/v4 format
- `@odata.bind` для relationship references
