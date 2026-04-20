# Инструкция по миграции: addon/query/filter-operator.js

## 📋 Тип Ember-модуля
- **Ember тип:** filter operator
- **Next.js тип:** filter operator constants

## 📁 Исходный файл (Ember)
```
// addon/query/filter-operator.js
export default {
  equal: 'eq',
  notEqual: 'ne',
  greaterThan: 'gt',
  lessThan: 'lt',
  // ... other operators
};
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/filter-operator.ts` — filter operator constants

## 📄 Готовый код

```typescript
// app/lib/query/filter-operator.ts
export enum FilterOperator {
  Equal = 'eq',
  NotEqual = 'ne',
  GreaterThan = 'gt',
  LessThan = 'lt',
  GreaterThanOrEqual = 'ge',
  LessThanOrEqual = 'le',
  Contains = 'contains',
  StartsWith = 'startswith',
  EndsWith = 'endswith',
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/filter-operator.ts` создан
- [ ] Типы определены
