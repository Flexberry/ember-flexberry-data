# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.ts`

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript
- zod

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.ts
import { transformOdataResponse } from './transform-odata';

export interface AuditField {
  Id: string;
  AuditEntityId: string;
  FieldName: string;
  OriginalValue: string;
  NewValue: string;
  ChangedBy: string;
  ChangedAt: string;
}

export function transformAuditField<T = AuditField>(data: any): T {
  const base = transformOdataResponse<T>(data);
  // Кастомная логика для AuditField
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.ts` создан
- [ ] Тип `AuditField` определен

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
