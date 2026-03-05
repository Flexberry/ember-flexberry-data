# Модуль: information-utils

## Файлы
- addon/utils/information.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовая утилита)

## Рекомендации по переносу

### Utility → TypeScript Module/Function

**Ember:** ES6 module → **Next.js:** `src/utils/information.ts`

**Пример шаблона:**
```ts
// utils/information.ts
export class Information {
  private store: any;

  constructor(store: any) {
    this.store = store;
  }

  // Check if attribute exists for model
  isExist(modelName: string, attributeName: string): boolean {
    const modelClass = this.store.modelFor(modelName);
    const attributes = modelClass.attributes;
    return attributes.has(attributeName);
  }

  // Get model attributes
  getAttributes(modelName: string): Map<string, any> {
    const modelClass = this.store.modelFor(modelName);
    return modelClass.attributes;
  }

  // Check if model exists in store
  isModelExists(modelName: string): boolean {
    try {
      this.store.modelFor(modelName);
      return true;
    } catch {
      return false;
    }
  }

  // Get relationship info
  getRelationshipInfo(modelName: string, relationshipName: string): any {
    const modelClass = this.store.modelFor(modelName);
    const relationships = modelClass.relationships;
    return relationships.get(relationshipName);
  }
}
```

## Порядок действий при переносе

1. Создать `information.ts` файл
2. Реализовать класс `Information`
3. Добавить методы проверки атрибутов и связей
4. Импорты из `ember-data` заменить на Next.js аналоги

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `Information` класс создан
- [ ] Методы `isExist`, `getAttributes` реализованы
- [ ] Импорты обновлены
- [ ] Тесты переписаны

## Примечания

- Простая утилита без внешних зависимостей
- Используется `store.modelFor()` для получения метаданных модели
