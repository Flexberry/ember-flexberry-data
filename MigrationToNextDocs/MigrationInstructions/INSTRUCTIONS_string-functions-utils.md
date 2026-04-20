# Модуль: string-functions-utils

## Файлы
- addon/utils/string-functions.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 utilities)

## Рекомендации по переносу

### Utils → Pure Functions

**Ember:** `addon/utils/string-functions.js` → **Next.js:** `src/utils/stringFunctions.ts`

**Пример шаблона:**
```ts
// utils/stringFunctions.ts
/* eslint-disable no-useless-escape */
const STRING_DASHERIZE_REGEXP = (/[ _]/g);
const STRING_CAMELIZE_REGEXP_1 = (/(\-|\_|\.|\s)+(.)?/g);
const STRING_CAMELIZE_REGEXP_2 = (/(^|\/)([A-ZА-ЯЁ])/g);
const STRING_CLASSIFY_REGEXP_1 = (/^(\-|_)+(.)?/);
const STRING_CLASSIFY_REGEXP_2 = (/(.)(\-|\_|\.|\s)+(.)?/g);
const STRING_CLASSIFY_REGEXP_3 = (/(^|\/|\.)([a-zа-яё])/g);
const STRING_UNDERSCORE_REGEXP_1 = (/([a-zа-яё\d])([A-ZА-ЯЁ]+)/g);
const STRING_UNDERSCORE_REGEXP_2 = (/\-|\s+/g);
const STRING_CAPITALIZE_REGEXP = (/(^|\/)([a-zа-яё])/g);
const STRING_DECAMELIZE_REGEXP = (/([a-zа-яё\d])([A-ZА-ЯЁ])/g);
const ODATA_DECAMELIZE_REGEXP = (/([A-ZА-ЯЁa-zа-яё\d])(?=[A-ZА-ЯЁ])/g);
/* eslint-enable no-useless-escape */

export function decamelize(str: string): string {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

export function dasherize(str: string): string {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

export function camelize(str: string): string {
  return str
    .replace(STRING_CAMELIZE_REGEXP_1, (match, separator, chr) => chr ? chr.toUpperCase() : '')
    .replace(STRING_CAMELIZE_REGEXP_2, (match, separator, chr) => match.toLowerCase());
}

export function classify(str: string): string {
  const replace1 = (match: string, separator: string, chr: string) => chr ? (`_${chr.toUpperCase()}`) : '';
  const replace2 = (match: string, initialChar: string, separator: string, chr: string) => initialChar + (chr ? chr.toUpperCase() : '');
  let parts = str.split('/');
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i]
      .replace(STRING_CLASSIFY_REGEXP_1, replace1)
      .replace(STRING_CLASSIFY_REGEXP_2, replace2);
  }
  return parts.join('/').replace(STRING_CLASSIFY_REGEXP_3, (match, separator, chr) => match.toUpperCase());
}

export function underscore(str: string): string {
  return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
}

export function capitalize(str: string): string {
  return str.replace(STRING_CAPITALIZE_REGEXP, (match, separator, chr) => match.toUpperCase());
}

export function odataSingularize(str: string): string {
  return str.replace(/s$/i, '');
}

export function odataPluralize(str: string): string {
  return str + 's';
}

export function odataDasherize(str: string): string {
  const decamelizedStr = str.replace(ODATA_DECAMELIZE_REGEXP, '$1_').toLowerCase();
  return decamelizedStr.replace(STRING_DASHERIZE_REGEXP, '-');
}
```

## Порядок действий при переносе

1. Создать `stringFunctions.ts`
2. Перенести все regex и функции
3. Убедиться, что русские символы поддерживаются

## Оценка трудозатрат

≈ 2–3 часов (low)

## Чек-лист для разработчика

- [ ] Все функции реализованы
- [ ] Regex поддерживают русские символы
- [ ] `decamelize`, `dasherize`, `camelize`, `classify`, `underscore`, `capitalize`
- [ ] OData функции: `odataSingularize`, `odataPluralize`, `odataDasherize`
- [ ] Тесты переписаны

## Примечания

- Ember string utils → чистые TypeScript функции
- Регулярные выражения сохранены (включая русские символы)
