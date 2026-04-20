# Инструкция по миграции: addon/query/builder.js

## 📋 Тип Ember-модуля
- **Ember тип:** odata query builder
- **Next.js тип:** OData query builder

## 📁 Исходный файл (Ember)
```
// addon/query/builder.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Builder logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/builder.ts` — builder function

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/builder.ts
export interface ODataQuery {
  $select?: string;
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $count?: boolean;
  [key: string]: any;
}

export function buildODataQuery(params: Record<string, any>): ODataQuery {
  const query: ODataQuery = {};
  // Builder logic
  return query;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/builder.ts` создан
- [ ] Функция `buildODataQuery` возвращает правильный OData query object
- [ ] Типы определены
