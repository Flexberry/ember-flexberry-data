# Инструкция по миграции: addon/utils/get-serialized-date-value.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/get-serialized-date-value.js
export function getSerializedDateValue(date: Date): string {
  // serialize date logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/get-serialized-date-value.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/get-serialized-date-value.ts
export function getSerializedDateValue(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/get-serialized-date-value.ts` создан
- [ ] Функция корректно сериализует даты
