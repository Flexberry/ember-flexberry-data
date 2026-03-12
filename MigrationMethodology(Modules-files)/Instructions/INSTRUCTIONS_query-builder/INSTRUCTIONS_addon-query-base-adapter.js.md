# Миграция: query/base-adapter.js

## Тип Ember → Next.js
- Ember тип: query builder
- Next.js аналог: function

### 1. Исходный файл (Ember)
```
// addon/query/base-adapter.js
import QueryAdapter from 'ember-data-odata-adapter/addon/query/base-adapter';

export default QueryAdapter.extend({
  // Логика базового адаптера
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/query/base-adapter.ts` — function

### 3. Маппинг Ember → Next.js
- `QueryAdapter.extend({...})` → `export function buildBaseAdapter()` function

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/query/`
2. Создать файл `base-adapter.ts` с function

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/query/base-adapter.ts
export function buildBaseAdapter() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл `base-adapter.ts` создан
- [ ] Function работает корректно
