# Миграция: transform/app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js

## Тип Ember → Next.js
- Ember тип: transform (переопределение)
- Next.js аналог: функция трансформации

### 1. Исходный файл (Ember)
```javascript
// app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
// Дубликат addon/... с переопределением
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.value || value;
  },

  deserialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return { value: value };
  }
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/$(echo app-transforms-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js | cut -d. -f1 | sed s/app-//g)-custom.ts` — кастомная function

### 3. Маппинг Ember → Next.js
- `Transform.extend(...)` → `export function transform*` function

### 4. Зависимости
- @tanstack/react-query, react, typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Если есть отличия от addon/ — создать $file-custom.ts

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/$(echo app-transforms-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js | cut -d. -f1 | sed s/app-//g)-custom.ts
import { transformFlexberryEnum } from '@/lib/transforms/flexberry-enum';

export function transformFlexberryEnumCustom(
  value: unknown,
  toBackend: boolean = false
): FlexberryEnum | string | number | null {
  const base = transformFlexberryEnum(value, toBackend);
  // Кастомные правила для app/
  return base;
}
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.ts
