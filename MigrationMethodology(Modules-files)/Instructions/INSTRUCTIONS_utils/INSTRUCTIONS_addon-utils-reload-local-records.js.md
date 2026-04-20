# Инструкция по миграции: addon/utils/reload-local-records.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/reload-local-records.js
export function reloadLocalRecords(store: any, modelName: string): Promise<void> {
  // reload local records logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/reload-local-records.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/reload-local-records.ts
export async function reloadLocalRecords<T = any>(modelName: string): Promise<void> {
  // reload local records logic
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/reload-local-records.ts` создан
- [ ] Типы определены
