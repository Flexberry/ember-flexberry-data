# Инструкция по миграции: addon/query/js-adapter.js

## 📋 Тип Ember-модуля
- **Ember тип:** js adapter
- **Next.js тип:** JS adapter for query

## 📁 Исходный файл (Ember)
```
// addon/query/js-adapter.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // JS adapter logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/js-adapter.ts` — JS adapter

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/js-adapter.ts
export function filterJS<T>(data: T[], conditions: Record<string, any>): T[] {
  // JS filter logic
  return data;
}

export function orderByJS<T>(data: T[], order: string): T[] {
  // JS order logic
  return data;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/js-adapter.ts` создан
- [ ] Функции фильтрации и сортировки работают
