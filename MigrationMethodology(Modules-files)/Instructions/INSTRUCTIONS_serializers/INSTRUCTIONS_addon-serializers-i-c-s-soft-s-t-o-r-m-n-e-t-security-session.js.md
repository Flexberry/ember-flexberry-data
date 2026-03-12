# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для i-c-s-soft-s-t-o-r-m-n-e-t-security-session
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts
import { transformOdataResponse } from './transform-odata';

export interface SecuritySession {
  Id: string;
  UserId: string;
  Token: string;
  ExpiresAt: string;
  IP: string;
  UserAgent: string;
}

export function transformSecuritySession<T = SecuritySession>(data: any): T {
  const base = transformOdataResponse<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts` создан
- [ ] Тип `SecuritySession` определен
