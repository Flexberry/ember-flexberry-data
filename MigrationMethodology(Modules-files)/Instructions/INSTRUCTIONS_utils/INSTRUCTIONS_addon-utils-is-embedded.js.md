# Инструкция по миграции: addon/utils/is-embedded.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/is-embedded.js
export function isEmbedded(model: any, attributeName: string): boolean {
  // check if embedded logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/is-embedded.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/is-embedded.ts
export function isEmbedded(model: any, attributeName: string): boolean {
  // check if embedded logic
  return false;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/is-embedded.ts` создан
- [ ] Типы определены
