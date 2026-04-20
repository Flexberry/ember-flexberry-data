# Миграция: stores/base-store.js, local-store.js, online-store.js, decorate-adapter.js, decorate-api-call.js

## Общая информация
Все файлы stores модуля.

### 1. Исходные файлы (Ember)
```
// addon/stores/base-store.js
// addon/stores/local-store.js
// addon/stores/online-store.js
// addon/stores/base-store/decorate-adapter.js
// addon/stores/base-store/decorate-api-call.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/store/*.ts` — functions

### 3. Маппинг Ember → Next.js
- `Store.extend({...})` → `export function createStore()` function
- `decorateAdapter()` → `export function decorateAdapter()` function

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/store/`
2. Для каждого файла создать его

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/store/base-store.ts
export function createBaseStore() {
  // Implementation
}

// app/lib/store/local-store.ts
export function createLocalStore() {
  // Implementation
}

// app/lib/store/online-store.ts
export function createOnlineStore() {
  // Implementation
}

// app/lib/store/decorate-adapter.ts
export function decorateAdapter() {
  // Implementation
}

// app/lib/store/decorate-api-call.ts
export function decorateApiCall() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файлы `*.ts` созданы
- [ ] Functions работают корректно
