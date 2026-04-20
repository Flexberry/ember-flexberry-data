# Модуль: is-object-utils, is-model-instance-utils, is-embedded-utils, is-uuid-utils

Это groups of single-function utils:

```
- is-object-utils
- is-model-instance-utils
- is-embedded-utils
- is-uuid-utils
- snapshot-transform-utils
- get-serialized-date-value-utils
```

## Рекомендации по переносу

### Single-function Utils → Pure Functions

**Ember:** `app/utils/*.js` → **Next.js:** `src/utils/*.ts`

**Пример шаблона:**
```ts
// utils/isObject.ts
export default function isObject(val: any): boolean {
  return val !== null && typeof val === 'object';
}

// utils/isModelInstance.ts
export default function isModelInstance(val: any): boolean {
  return val?.get && val.get?.('constructor.modelName');
}

// utils/isEmbedded.ts
export default function isEmbedded(store: any, modelType: any, relationshipName: string): boolean {
  const serializerAttrs = store.serializerFor(modelType.modelName)?.get?.('attrs');
  return serializerAttrs?.[relationshipName] &&
    ((serializerAttrs[relationshipName].embedded && serializerAttrs[relationshipName].embedded === 'always') ||
    (serializerAttrs[relationshipName].deserialize && serializerAttrs[relationshipName].deserialize === 'records'));
}

// utils/isUUID.ts
export default function isUUID(uuid: any): boolean {
  const uuidStr = String(uuid);
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuidStr);
}

// utils/snapshotTransform.ts
export function transformForSerialize(snapshot: any, skipUnchangedAttrs = true): any {
  if (skipUnchangedAttrs) {
    const changedAttributes = Object.keys(snapshot.changedAttributes?.() ?? {});
    for (let attrKey in snapshot._attributes ?? {}) {
      const attrIsChanged = changedAttributes.indexOf(attrKey) !== -1;
      if (!attrIsChanged) {
        delete snapshot._attributes[attrKey];
      }
    }

    snapshot.eachAttribute = function(callback: Function, binding: any) {
      if (!snapshot.record) {
        return snapshot;
      } else {
        snapshot.record.eachAttribute?.(function(name: string, meta: any) {
          if (name in snapshot._attributes) {
            callback.call(binding, name, meta);
          }
        }, binding);
      }
    };
  }

  return snapshot;
}

// utils/getSerializedDateValue.ts
export function getSerializedDateValue(date: Date | string | null): string | null {
  if (!date) return null;
  return new Date(date).toISOString();
}
```

## Порядок действий при переносе

1. Создать `utils/` directory (если ещё не создан)
2. Создать files для каждого utility function
3. Implement functions

## Оценка трудозатрат

≈ 5-7 часов (medium)

## Чек-лист для разработчика

- [ ] all utility functions created
- [ ] isObject, isModelInstance, isEmbedded, isUUID
- [ ] transformForSerialize, getSerializedDateValue
- [ ] Тесты переписаны

## Примечания

- Ember utils → TypeScript functions
- Ember `get()` → native access или optional chaining
