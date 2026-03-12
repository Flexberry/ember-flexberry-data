# Инструкция по миграции: addon/utils/model-functions.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/model-functions.js
export function createRecord(store: any, type: any, payload: any): any {
  // create record logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/model-functions.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/model-functions.ts
export function createRecord<T = any>(payload: Partial<T>): T {
  // create record logic
  return {} as T;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/model-functions.ts` создан
- [ ] Типы определены
