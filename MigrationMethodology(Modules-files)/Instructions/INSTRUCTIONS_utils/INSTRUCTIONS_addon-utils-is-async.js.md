# Инструкция по миграции: addon/utils/is-async.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/is-async.js
export function isAsync(func: any): boolean {
  // check if async logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/is-async.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/is-async.ts
export function isAsync(value: any): boolean {
  return value && value.constructor && value.constructor.name === 'AsyncFunction';
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/is-async.ts` создан
- [ ] Функция корректно определяет async functions
