# Инструкция по миграции: addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (DS.Serializer)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные настройки для i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.ts`

## 🔄 Маппинг Ember → Next.js
- `Serializer.extend({...})` → `export function transform*` function

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript
- zod (валидация)

## 🧩 Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.ts`
3. Использовать функцию в `transformResponse` для преобразования данных

## 💻 Готовый код

```typescript
// app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.ts
import { transformOdataResponse } from './transform-odata';

export interface AuditEntity {
  Id: string;
  Name: string;
  Description: string;
  // ... другие поля модели AuditEntity
}

export function transformAuditEntity<T = AuditEntity>(data: any): T {
  const base = transformOdataResponse<T>(data);
  // Кастомная логика для AuditEntity
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.ts` создан
- [ ] Функция `transformAuditEntity` обрабатывает Response
- [ ] Тип `AuditEntity` определен
- [ ] Тесты трансформации проходят
