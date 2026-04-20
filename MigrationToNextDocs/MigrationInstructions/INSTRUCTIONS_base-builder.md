# Модуль: base-builder

## Файлы
- addon/query/base-builder.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовая база для builder)

## Рекомендации по переносу

### BaseBuilder → TypeScript Base Class

**Ember:** ES6 class → **Next.js:** `src/query/baseBuilder.ts`

**Пример шаблона:**
```ts
// query/baseBuilder.ts
export class BaseBuilder {
  /**
   * Builds query.
   * @returns {Object} Query instance.
   */
  build(): any {
    // Override in subclasses
    throw new Error('build() must be implemented in subclass');
  }
}
```

## Порядок действий при переносе

1. Создать `BaseBuilder` класс
2. Реализовать абстрактный `build()` метод
3. Использовать как базовый класс для `Builder`

## Оценка трудозатрат

≈ 0.5 часа (low)

## Чек-лист для разработчика

- [ ] `BaseBuilder` класс создан
- [ ] `build()` метод объявлен
- [ ] Используется как базовый класс для `Builder`

## Примечания

- Простая базовая реализация
- Наследуется `Builder`
