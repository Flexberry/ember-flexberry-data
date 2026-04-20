# Миграция: model/app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js

## Тип Ember → Next.js
- Ember тип: model (переопределение)
- Next.js аналог: TypeScript interface + hooks

### 1. Исходный файл (Ember)
```javascript
// app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
// Дубликат addon/... с переопределением
import Model from '../models/model';

export default Model.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/types/$(echo app-models-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js | cut -d. -f1 | sed s/app-//g)-custom.ts` — кастомный interface

### 3. Маппинг Ember → Next.js
- `Model.extend(...)` → `export interface ...` extends BaseModel

### 4. Зависимости
- @tanstack/react-query, react, typescript, zod

### 5. Алгоритм миграции
1. Создать папку `app/lib/types/`
2. Если есть отличия от addon/ — создать $file-custom.ts

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/$(echo app-models-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js | cut -d. -f1 | sed s/app-//g)-custom.ts
import { BaseModel } from '@/lib/types/model';

export interface BaseModelCustom extends BaseModel {
  // Кастомные свойства для app/
}
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.ts
