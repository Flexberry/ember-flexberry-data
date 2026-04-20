# Модуль: adapter-mixin

## Файлы
- addon/mixins/adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый mixin)

## Рекомендации по переносу

### Mixin → TypeScript Function or Decorator

**Ember:** `Mixin.create({})` → **Next.js:** `src/mixins/adapterMixin.ts`

**Пример шаблона:**
```ts
// mixins/adapterMixin.ts
export function AdapterMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Build URL for query record
    urlForQueryRecord(query: any, modelName: string): string {
      const id = query.id;
      delete query.id;
      return this._buildURL(modelName, id);
    }
  };
}

// Использование:
// class OfflineAdapter extends AdapterMixin(BaseAdapter) {
//   // ...
// }
```

## Порядок действий при переносе

1. Создать `AdapterMixin` функцию
2. Реализовать `urlForQueryRecord()` method

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `AdapterMixin` реализован
- [ ] `urlForQueryRecord()` method
- [ ] Тесты переписаны

## Примечания

- Простой mixin для адаптеров
- TypeScript mixin pattern
