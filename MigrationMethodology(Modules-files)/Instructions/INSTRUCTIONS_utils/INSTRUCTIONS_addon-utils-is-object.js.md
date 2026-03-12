# Инструкция по миграции: addon/utils/is-object.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/is-object.js
export function isObject(value: any): boolean {
  // check if object logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/is-object.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/is-object.ts
export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/is-object.ts` создан
- [ ] Функция корректно определяет объекты
