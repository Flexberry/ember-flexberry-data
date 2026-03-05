# Модуль: enum-functions-utils

## Файлы
- addon/utils/enum-functions.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (но используется information-utils dependencies)

## Рекомендации по переносу

### Utils → Pure Functions

**Ember:** `addon/utils/enum-functions.js` → **Next.js:** `src/utils/enumFunctions.ts`

**Пример шаблона:**
```ts
// utils/enumFunctions.ts
import { merge } from '@ember/polyfills'; // или lodash.merge
import { isArray } from '@ember/array'; // или Array.isArray

export function createEnum(dictionary: Record<string, any> | any[]): Record<string, any> {
  let local: Record<string, any> = {};
  
  if (isArray(dictionary)) {
    dictionary.forEach(element => local[element] = element);
  } else {
    local = dictionary;
  }

  return Object.freeze(merge(Object.create(null), local));
}

export function inverseEnum(dictionary: Record<string, any>): Record<string, any> {
  const inverse: Record<string, any> = {};
  
  for (let key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      inverse[dictionary[key]] = key;
    }
  }

  return createEnum(inverse);
}

export function enumCaptions(dictionary: Record<string, any>): Record<string, any> {
  const captions: Record<string, any> = {};

  for (let key in dictionary) {
    if (dictionary.hasOwnProperty(key) && dictionary[key] !== null) {
      captions[key] = dictionary[key];
    } else if (dictionary[key] === null) {
      captions[key] = '';
    }
  }

  return captions;
}
```

## Порядок действий при переносе

1. Создать `createEnum()`, `inverseEnum()`, `enumCaptions()` функции
2. Заменить Ember polyfills на native/lodash
3. Обработать null значения в `enumCaptions()`

## Оценка трудозатрат

≈ 2–3 часов (low)

## Чек-лист для разработчика

- [ ] `createEnum()` реализована
- [ ] `inverseEnum()` реализована
- [ ] `enumCaptions()` реализована
- [ ] `Object.freeze()` используется
- [ ] null handled в `enumCaptions()`
- [ ] Тесты переписаны

## Примечания

- Ember polyfills → native или lodash
- Object.freeze() для неизменяемости
