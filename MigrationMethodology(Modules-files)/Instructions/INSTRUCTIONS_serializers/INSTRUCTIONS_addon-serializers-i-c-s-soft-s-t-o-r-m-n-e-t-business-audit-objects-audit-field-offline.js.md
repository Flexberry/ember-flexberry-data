# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer, offline)
- **Next.js тип:** function для преобразования офлайн данных

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для офлайн режима
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.ts
import { transformAuditField } from './transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field';

export interface OfflineAuditField {
  Id: string;
  AuditEntityId: string;
  FieldName: string;
  OriginalValue: string;
  NewValue: string;
  ChangedBy: string;
  ChangedAt: string;
}

export function transformOfflineAuditField<T = OfflineAuditField>(data: any): T {
  const base = transformAuditField<T>(data);
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.ts` создан
