# Модуль: model-functions-utils

## Файлы
- addon/utils/model-functions.js

## Зависимости (должны быть перенесены ДО этого модуля)
- information-utils

## Рекомендации по переносу

### Utils → Pure Functions

**Ember:** `addon/utils/model-functions.js` → **Next.js:** `src/utils/modelFunctions.ts`

**Пример шаблона:**
```ts
// utils/modelFunctions.ts
import { get } from '@ember/object'; // или native Object

export function getRelationType(model: any, relationName: string): string {
  // Get ember static function to get relation by name.
  const relationshipsByName = get(model.constructor, 'relationshipsByName');

  // Get relation property from model.
  const relation = relationshipsByName.get(relationName);
  if (!relation) {
    throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
  }

  const relationType = relation.type;
  return relationType;
}

export function getValueFromLocales(i18n: any, key: string): string | null {
  if (!key) {
    throw new Error('key should be defined');
  }

  if (i18n.exists(key)) {
    return i18n.t(key);
  } else {
    console.warn(`The ${key} is not found in locales.`);
    return null;
  }
}
```

## Порядок действий при переносе

1. Создать `modelFunctions.ts`
2. Реализовать `getRelationType()`
3. Реализовать `getValueFromLocales()`
4. Заменить Ember `get()` и `assert`/`warn` на native

## Оценка трудозатрат

≈ 2–3 часов (low)

## Чек-лист для разработчика

- [ ] `getRelationType()` реализована
- [ ] `getValueFromLocales()` реализована
- [ ] Ember `get()` → native access
- [ ] Ember `assert`/`warn` → native `throw`/`console.warn`
- [ ] Тесты переписаны

## Примечания

- Ember object utils → native access
- `relationshipsByName.get()` → `model.relationshipsByName.get()`
