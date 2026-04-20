# Инструкция по миграции: addon/utils/information.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/information.js
export function getInformation(record: any): any {
  // get information logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/information.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/information.ts
export interface ModelInformation {
  modelName: string;
  recordId: string;
  createdAt: string;
  updatedAt: string;
}

export function getInformation(record: any): ModelInformation {
  // get information logic
  return {
    modelName: '',
    recordId: '',
    createdAt: '',
    updatedAt: '',
  };
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/information.ts` создан
- [ ] Типы определены
