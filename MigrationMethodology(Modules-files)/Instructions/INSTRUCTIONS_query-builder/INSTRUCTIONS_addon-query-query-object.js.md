# Инструкция по миграции: addon/query/query-object.js

## 📋 Тип Ember-модуля
- **Ember тип:** query object
- **Next.js тип:** query object builder

## 📁 Исходный файл (Ember)
```
// addon/query/query-object.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Query object logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/query-object.ts` — query object builder

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/query-object.ts
export interface QueryObject {
  modelName: string;
  filter?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
  count?: boolean;
  select?: string[];
}

export function buildQueryObject(query: QueryObject): string {
  const params: Record<string, any> = {};
  if (query.filter) params.$filter = query.filter;
  if (query.orderBy) params.$orderby = query.orderBy;
  if (query.top !== undefined) params.$top = query.top;
  if (query.skip !== undefined) params.$skip = query.skip;
  if (query.count) params.$count = true;
  if (query.select && query.select.length > 0) params.$select = query.select.join(',');
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `?${queryString}` : '';
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/query-object.ts` создан
- [ ] Типы определены
- [ ] Функция `buildQueryObject` возвращает правильную query string
