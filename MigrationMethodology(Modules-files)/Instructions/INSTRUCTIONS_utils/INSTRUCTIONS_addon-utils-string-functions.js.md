# Инструкция по миграции: addon/utils/string-functions.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/string-functions.js
export function capitalize(str: string): string {
  // capitalize logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/string-functions.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/string-functions.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (g) => `_${g[0].toLowerCase()}`);
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/string-functions.ts` создан
- [ ] Функции работают корректно
