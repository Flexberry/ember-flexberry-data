# Инструкция по миграции: addon/utils/is-model-instance.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/is-model-instance.js
export function isModelInstance(record: any): boolean {
  // check if model instance logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/is-model-instance.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/is-model-instance.ts
export function isModelInstance(record: any): boolean {
  return record && typeof record === 'object' && record.id;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/is-model-instance.ts` создан
- [ ] Функция корректно определяет model instances
