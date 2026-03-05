# Модуль: is-model-instance-utils

## Файлы
- addon/utils/is-model-instance.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (простая утилита)

## Рекомендации по переносу

### Utility → TypeScript Function

**Ember:** ES6 module → **Next.js:** `src/utils/isModelInstance.ts`

**Пример шаблона:**
```ts
// utils/isModelInstance.ts
export function isModelInstance(val: any): boolean {
  return val && val.get && val.get('constructor.modelName');
}

// Usage
if (isModelInstance(record)) {
  // work with Ember Data model instance
}
```

## Порядок действий при переносе

1. Создать `isModelInstance.ts` файл
2. Переписать функцию `isModelInstance`
3. Добавить TypeScript типы

## Оценка трудозатрат

≈ 0.5-1 час (low)

## Чек-лист для разработчика

- [ ] `isModelInstance` функция создана
- [ ] TypeScript типы добавлены
- [ ] Тесты переписаны

## Примечания

- Проверяет, является ли объект экземпляром Ember Data модели
- Простая утилита без зависимостей
