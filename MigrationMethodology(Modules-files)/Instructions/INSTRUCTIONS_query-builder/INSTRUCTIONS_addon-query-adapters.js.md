# Миграция: query/indexeddb-adapter.js, query/js-adapter.js, query/odata-adapter.js

## Общая информация
Остальные файлы query-builder: adapters.

### 1. Исходные файлы (Ember)
```
// addon/query/indexeddb-adapter.js
// addon/query/js-adapter.js
// addon/query/odata-adapter.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/query/indexeddb-adapter.ts`
- `app/lib/query/js-adapter.ts`
- `app/lib/query/odata-adapter.ts`

### 3. Маппинг Ember → Next.js
- `Adapter.extend({...})` → `export function createAdapter()` function

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/query/`
2. Для каждого файла создать его

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/query/indexeddb-adapter.ts
export function createIndexedDBAdapter() {
  // Implementation
}

// app/lib/query/js-adapter.ts
export function createJSAdapter() {
  // Implementation
}

// app/lib/query/odata-adapter.ts
export function createODataAdapter() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файлы `*.ts` созданы
- [ ] Functions работают корректно
