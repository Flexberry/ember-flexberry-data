# Модуль: is-object-utils

## Файлы
- addon/utils/is-object.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (простая утилита)

## Рекомендации по переносу

### Utility → TypeScript Function

**Ember:** ES6 module → **Next.js:** `src/utils/isObject.ts`

**Пример шаблона:**
```ts
// utils/isObject.ts
export function isObject(val: any): boolean {
  return val !== null && typeof val === 'object';
}

// Usage
if (isObject(data)) {
  // work with object
}
```

## Порядок действий при переносе

1. Создать `isObject.ts` файл
2. Переписать функцию `isObject`
3. Добавить TypeScript типы

## Оценка трудозатрат

≈ 0.5-1 час (low)

## Чек-лист для разработчика

- [ ] `isObject` функция создана
- [ ] TypeScript типы добавлены
- [ ] Тесты переписаны

## Примечания

- Простая утилита без зависимостей
- Не требует Ember API
