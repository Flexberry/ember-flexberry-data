# Инструкция по миграции: addon/utils/is-uuid.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/is-uuid.js
export function isUUID(value: any): boolean {
  // check if UUID logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/is-uuid.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/is-uuid.ts
export function isUUID(value: any): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/is-uuid.ts` создан
- [ ] Функция корректно определяет UUID
