# Инструкция по миграции: addon/query/order-by-clause.js

## 📋 Тип Ember-модуля
- **Ember тип:** order by clause
- **Next.js тип:** order by clause builder

## 📁 Исходный файл (Ember)
```
// addon/query/order-by-clause.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Order by logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/order-by-clause.ts` — order by clause

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/order-by-clause.ts
export interface OrderClause {
  field: string;
  direction: 'asc' | 'desc';
}

export function buildOrderBy(clauses: OrderClause[]): string {
  return clauses.map(c => `${c.field} ${c.direction}`).join(', ');
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/order-by-clause.ts` создан
- [ ] Типы определены
