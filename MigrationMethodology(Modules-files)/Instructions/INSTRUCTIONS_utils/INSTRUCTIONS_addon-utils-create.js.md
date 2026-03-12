# Инструкция по миграции: addon/utils/create.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/create.js
export function createRecord(store: any, type: any, payload: any): any {
  // create record logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/create.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/create.ts
export function createRecord<T = any>(payload: Partial<T>): T {
  // create record logic
  return {} as T;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/create.ts` создан
- [ ] Типы определены
