# Модуль: base-serializer

## Файлы
- addon/serializers/base.js
- app/serializers/base.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 serializer)

## Рекомендации по переносу

### Serializer → Class with JSON Serialization

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/baseSerializer.ts`

**Пример шаблона:**
```ts
// serializers/baseSerializer.ts
export class BaseSerializer {
  modelNameFromPayloadKey(key: string): string {
    // ... Ember -> Next.js model name mapping
  }

  payloadKeyFromModelName(modelName: string): string {
    // ... Next.js -> Ember model name mapping
  }

  serialize(snapshot: any): any {
    // ... serialize record to payload
  }

  serializeIntoHash(hash: any, type: any, snapshot: any): any {
    // ... serialize into hash
  }

  normalizeResponse(store: any, primaryModelClass: any, payload: any, id: string, requestType: string): any {
    // ... normalize server response
  }

  normalize(modelClass: any, resourceHash: any): any {
    // ... normalize individual record
  }

  extractId(modelClass: any, resourceHash: any): string {
    // ... extract record ID
  }

  extractType(modelClass: any, resourceHash: any): string {
    // ... extract model type
  }

  // Handle metadata
  extractMeta(store: any, modelClass: any, payload: any): any {
    // ... extract metadata from response
  }
}
```

## Порядок действий при переносе

1. Создать `BaseSerializer` класс
2. Реализовать serialize/deserialize методы
3. Обработать metadata
4. Обработать normalization

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `BaseSerializer` класс создан
- [ ] serialize методы реализованы
- [ ] normalize методы реализованы
- [ ] metadata handling
- [ ] Тесты переписаны

## Примечания

- Ember Data Serializer → TypeScript class
- JSON serialization/deserialization
