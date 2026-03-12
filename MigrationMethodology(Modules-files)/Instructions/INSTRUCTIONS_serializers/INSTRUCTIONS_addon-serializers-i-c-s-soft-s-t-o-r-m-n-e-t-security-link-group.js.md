# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.ts
import { transformOdataResponse } from './transform-odata';

export interface SecurityLinkGroup {
  Id: string;
  Name: string;
  Description: string;
}

export function transformSecurityLinkGroup<T = SecurityLinkGroup>(data: any): T {
  const base = transformOdataResponse<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.ts` создан
- [ ] Тип `SecurityLinkGroup` определен
