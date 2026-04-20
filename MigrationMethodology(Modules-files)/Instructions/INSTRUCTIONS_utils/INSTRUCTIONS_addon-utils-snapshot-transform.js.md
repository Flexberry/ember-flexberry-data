# Инструкция по миграции: addon/utils/snapshot-transform.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/snapshot-transform.js
export function snapshotTransform(record: any): any {
  // snapshot transform logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/snapshot-transform.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/snapshot-transform.ts
export interface Snapshot {
  id: string;
  data: any;
  type: string;
}

export function snapshotTransform(record: any): Snapshot {
  // snapshot transform logic
  return {
    id: '',
    data: {},
    type: '',
  };
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/snapshot-transform.ts` создан
- [ ] Типы определены
