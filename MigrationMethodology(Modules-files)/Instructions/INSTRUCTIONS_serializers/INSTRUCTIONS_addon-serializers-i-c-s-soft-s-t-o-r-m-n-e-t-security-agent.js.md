# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для i-c-s-soft-s-t-o-r-m-n-e-t-security-agent
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.ts
import { transformOdataResponse } from './transform-odata';

export interface SecurityAgent {
  Id: string;
  Name: string;
  Description: string;
}

export function transformSecurityAgent<T = SecurityAgent>(data: any): T {
  const base = transformOdataResponse<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.ts` создан
- [ ] Тип `SecurityAgent` определен
