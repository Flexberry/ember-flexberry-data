# Модуль: is-async-utils

## Файлы
- addon/utils/is-async.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый модуль)

## Рекомендации по переносу

### Utils → Pure Function

**Ember:** `addon/utils/is-async.js` → **Next.js:** `src/utils/isAsync.ts`

**Пример шаблона:**
```ts
// utils/isAsync.ts
export default function isAsync(type: any, attrName: string): boolean {
  const relationshipMeta = type.relationshipsByName?.get(attrName);
  return (
    relationshipMeta &&
    relationshipMeta.options &&
    relationshipMeta.options.hasOwnProperty('async')
  ) ? relationshipMeta.options.async : true;
}
```

### Usage → Direct Function Call

```ts
import isAsync from '@/utils/isAsync';

const asyncFlag = isAsync(modelType, 'relationName');
```

## Порядок действий при переносе

1. Создать `isAsync()` функцию
2. Убедиться, что `relationshipsByName.get()` заменён на правильный доступ
3. Обработать дефолтное значение `true`

## Оценка трудозатрат

≈ 1–2 часа (low)

## Чек-лист для разработчика

- [ ] `isAsync()` функция реализована
- [ ] `relationshipsByName.get()` → правильный доступ
- [ ] Дефолтное значение `true` сохранено
- [ ] Тесты переписаны

## Примечания

- Простая утилита → чистая функция
- Ember `get()` → native property access или optional chaining
