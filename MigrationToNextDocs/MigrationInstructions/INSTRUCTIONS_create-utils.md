# Модуль: create-utils

## Файлы
- addon/utils/create.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый модуль)

## Рекомендации по переносу

### Utils → Pure Function

**Ember:** `addon/utils/create.js` → **Next.js:** `src/utils/create.ts`

**Пример шаблона:**
```ts
// utils/create.ts
export default function create(
  modelName: string,
  attributes: Record<string, any>,
  projectionName?: string
) {
  return {
    projectionName: projectionName || undefined,
    modelName,
    attributes: attributes || {}
  };
}
```

## Порядок действий при переносе

1. Создать `create()` функцию
2. Убедиться, что возвращаемый объект соответствует Ember-projection

## Оценка трудозатрат

≈ 1–2 часа (low)

## Чек-лист для разработчика

- [ ] `create()` функция реализована
- [ ] Возвращаемый объект правильный
- [ ] Тесты переписаны

## Примечания

- Простая фабрика → чистая функция
