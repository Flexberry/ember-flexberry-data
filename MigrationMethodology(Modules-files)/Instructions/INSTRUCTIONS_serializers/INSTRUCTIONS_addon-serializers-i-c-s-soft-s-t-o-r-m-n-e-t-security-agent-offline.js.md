# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer, offline)
- **Next.js тип:** function для преобразования офлайн данных

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для офлайн режима
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.ts
import { transformSecurityAgent } from './transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent';

export interface OfflineSecurityAgent {
  Id: string;
  Name: string;
  Description: string;
}

export function transformOfflineSecurityAgent<T = OfflineSecurityAgent>(data: any): T {
  const base = transformSecurityAgent<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.ts` создан
