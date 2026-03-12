# Миграция: serializer/app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js

## Тип Ember → Next.js
- Ember тип: serializer (переопределение)
- Next.js аналог: функция трансформации

### 1. Исходный файл (Ember)
```javascript
// app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
// Дубликат addon/... с переопределением
import ODataSerializer from '../serializers/odata';

export default ODataSerializer.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/$(echo app-serializers-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js | cut -d. -f1 | sed s/app-//g)-custom.ts` — кастомная function

### 3. Маппинг Ember → Next.js
- `Serializer.extend(...)` → `export function transform*` function

### 4. Зависимости
- @tanstack/react-query, react, typescript, zod

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Если есть отличия от addon/ — создать $file-custom.ts

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/$(echo app-serializers-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js | cut -d. -f1 | sed s/app-//g)-custom.ts
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

export function transformOdataResponseCustom<T = any>(data: any): T {
  const base = transformOdataResponse<T>(data);
  // Кастомные правила для app/
  return base;
}
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.ts
