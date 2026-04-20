# Инструкция по миграции: addon/query/predicate.js

## 📋 Тип Ember-модуля
- **Ember тип:** predicate builder
- **Next.js тип:** predicate builder

## 📁 Исходный файл (Ember)
```
// addon/query/predicate.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Predicate logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/predicate.ts` — predicate builder

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/predicate.ts
export interface Predicate {
  field: string;
  operator: string;
  value: any;
}

export function buildPredicate(predicates: Predicate[]): string {
  // Join predicates with ' and '
  return predicates.map(p => `${p.field} ${p.operator} ${p.value}`).join(' and ');
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/predicate.ts` создан
- [ ] Типы определены
