# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer, offline)
- **Next.js тип:** function для преобразования офлайн данных

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для офлайн режима
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.ts`

## 🔄 Маппинг Ember → Next.js
- `Serializer.extend({...})` → `export function transform*` function

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 🧩 Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.ts`
3. Использовать функцию в офлайн кэше

## 💻 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.ts
import { transformAuditEntity } from './transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity';

export interface OfflineAuditEntity {
  Id: string;
  Name: string;
  Description: string;
  // ... другие поля модели AuditEntity
}

export function transformOfflineAuditEntity<T = OfflineAuditEntity>(data: any): T {
  const base = transformAuditEntity<T>(data);
  // Кастомная логика для офлайн режима
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.ts` создан
- [ ] Функция `transformOfflineAuditEntity` обрабатывает офлайн данные
