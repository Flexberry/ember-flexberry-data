# Инструкция по миграции: addon/utils/first-load-offline-objects.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/first-load-offline-objects.js
export function firstLoadOfflineObjects(store: any, modelName: string): Promise<void> {
  // first load logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/first-load-offline-objects.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/first-load-offline-objects.ts
export async function firstLoadOfflineObjects<T = any>(modelName: string): Promise<void> {
  // first load logic
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/first-load-offline-objects.ts` создан
- [ ] Типы определены
