# Инструкция по миграции: addon/utils/attributes.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/attributes.js
import EmberObject from '@ember/object';

export function getAttributes(model: any): any {
  // get attributes logic
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/attributes.ts` — utility function

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/attributes.ts
export interface ModelAttribute {
  name: string;
  type: string;
  options: any;
}

export function getAttributes(model: any): ModelAttribute[] {
  // get attributes logic
  return [];
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/attributes.ts` создан
- [ ] Типы определены
