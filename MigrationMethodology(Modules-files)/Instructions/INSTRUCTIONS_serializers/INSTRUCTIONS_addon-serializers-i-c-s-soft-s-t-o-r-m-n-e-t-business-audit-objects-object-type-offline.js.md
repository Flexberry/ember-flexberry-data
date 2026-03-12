# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer, offline)
- **Next.js тип:** function для преобразования офлайн данных

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для офлайн режима
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.ts
import { transformObjectType } from './transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type';

export interface OfflineObjectType {
  Id: string;
  Name: string;
  Description: string;
}

export function transformOfflineObjectType<T = OfflineObjectType>(data: any): T {
  const base = transformObjectType<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.ts` создан
