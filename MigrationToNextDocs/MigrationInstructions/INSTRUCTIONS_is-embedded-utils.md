# Модуль: is-embedded-utils

## Файлы
- addon/utils/is-embedded.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (простая утилита)

## Рекомендации по переносу

### Utility → TypeScript Function

**Ember:** ES6 module → **Next.js:** `src/utils/isEmbedded.ts`

**Пример шаблона:**
```ts
// utils/isEmbedded.ts
export function isEmbedded(store: any, modelType: any, relationshipName: string): boolean {
  const serializerAttrs = store.serializerFor(modelType.modelName)?.attrs;
  const relationshipAttr = serializerAttrs?.[relationshipName];
  
  return relationshipAttr && 
    ((relationshipAttr.embedded && relationshipAttr.embedded === 'always') ||
    (relationshipAttr.deserialize && relationshipAttr.deserialize === 'records'));
}

// Usage
if (isEmbedded(store, modelType, 'relationship')) {
  // embedded relationship handling
}
```

## Порядок действий при переносе

1. Создать `isEmbedded.ts` файл
2. Переписать функцию `isEmbedded`
3. Добавить TypeScript типы
4. Сериализатор заменить на соответствующий API Next.js

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `isEmbedded` функция создана
- [ ] TypeScript типы добавлены
- [ ] Работа со сериализатором настроена
- [ ] Тесты переписаны

## Примечания

- Использует API сериализатора
- Проверяет embedded-режим для отношений
