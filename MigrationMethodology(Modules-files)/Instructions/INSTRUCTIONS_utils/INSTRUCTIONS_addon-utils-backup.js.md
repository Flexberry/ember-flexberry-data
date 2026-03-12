# Инструкция по миграции: addon/utils/backup.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/backup.js
export function createBackup(record: any): any {
  // create backup logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/backup.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/backup.ts
export interface BackupData {
  id: string;
  data: any;
  createdAt: string;
}

export function createBackup(record: any): BackupData {
  // create backup logic
  return {
    id: '',
    data: {},
    createdAt: new Date().toISOString(),
  };
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/backup.ts` создан
- [ ] Типы определены
