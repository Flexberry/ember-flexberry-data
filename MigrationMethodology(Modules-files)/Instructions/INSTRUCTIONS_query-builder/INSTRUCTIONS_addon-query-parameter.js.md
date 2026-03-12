# Инструкция по миграции: addon/query/parameter.js

## 📋 Тип Ember-модуля
- **Ember тип:** query parameter
- **Next.js тип:** parameter builder

## 📁 Исходный файл (Ember)
```
// addon/query/parameter.js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Parameter logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/query/parameter.ts` — parameter builder

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/query/parameter.ts
export interface QueryParameter {
  key: string;
  value: any;
}

export function buildParameter(param: QueryParameter): string {
  return `${param.key}=${encodeURIComponent(param.value)}`;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/query/parameter.ts` создан
- [ ] Типы определены
