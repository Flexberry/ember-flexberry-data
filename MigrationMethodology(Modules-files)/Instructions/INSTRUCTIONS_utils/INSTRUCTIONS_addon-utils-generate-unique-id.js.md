# Инструкция по миграции: addon/utils/generate-unique-id.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/generate-unique-id.js
export function generateUniqueId(): string {
  // generate unique id logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/generate-unique-id.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/generate-unique-id.ts
export function generateUniqueId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/generate-unique-id.ts` создан
- [ ] Функция генерирует уникальные ID
