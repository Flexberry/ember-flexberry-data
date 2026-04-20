# Модуль: base-adapter

## Файлы
- addon/query/base-adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовая база для query adapters)

## Рекомендации по переносу

### BaseAdapter → TypeScript Base Class

**Ember:** ES6 class → **Next.js:** `src/query/adapters/baseAdapter.ts`

**Пример шаблона:**
```ts
// query/adapters/baseAdapter.ts
export abstract class BaseAdapter {
  // Base interface for query adapters
  //Concrete adapters (JSAdapter, ODataAdapter, IndexedDBAdapter) extend this
}
```

## Порядок действий при переносе

1. Создать `BaseAdapter` абстрактный класс
2. Использовать как базовый класс для всех adapters
3. Определить интерфейс для Concrete adapters

## Оценка трудозатрат

≈ 0.5 часа (low)

## Чек-лист для разработчика

- [ ] `BaseAdapter` класс создан
- [ ] Используется как базовый класс для JSAdapter/ODataAdapter/IndexedDBAdapter

## Примечания

- Минимальная реализация
- Шаблон для других adapters
