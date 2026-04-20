# Инструкция по миграции: addon/utils/enum-functions.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/enum-functions.js
export function normalizeEnumValue(value: any): string {
  // normalize enum value logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/enum-functions.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/enum-functions.ts
export function normalizeEnumValue(value: any): string {
  // normalize enum value logic
  return '';
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/enum-functions.ts` создан
- [ ] Типы определены
