# Инструкция по миграции: addon/query/condition.js

## 📋 Тип Ember-модуля
- **Ember тип:** odata condition
- **Next.js тип:** condition builder

## 📁 Исходный файл (Ember)
```
// addon/query/condition.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Condition logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/condition.ts` — condition builder

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/condition.ts
export interface Condition {
  field: string;
  operator: string;
  value: any;
}

export function buildCondition(condition: Condition): string {
  // Condition logic
  return '';
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/condition.ts` создан
- [ ] Типы определены
