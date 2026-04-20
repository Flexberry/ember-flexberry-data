# Миграция: regenerated-serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js

## Тип Ember → Next.js
- Ember тип: serializer
- Next.js аналог: функция трансформации

### 1. Исходный файл (Ember)
```javascript
// addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
import ODataSerializer from '../../../serializers/odata';

export default ODataSerializer.extend({
  // Логика для i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/serializer-$(echo i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js | cut -d. -f1).ts` — function

### 3. Маппинг Ember → Next.js
- `ODataSerializer.extend(...)` → `export function transform*Response()` function

### 4. Зависимости
- @tanstack/react-query, react, typescript, axios

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл с функцией `transform*Response`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-$(echo i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js | cut -d. -f1).ts
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

export function transformi-c-s-soft-s-t-o-r-m-n-e-t-security-link-groupResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}
```

### 7. Чек-лист валидации
- [ ] Файл создан
- [ ] Function работает корректно
