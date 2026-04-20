# Миграция: initializer/app/initializers/local-store.js

## Тип Ember → Next.js
- Ember тип: initializer (переопределение)
- Next.js аналог: setup function в layout.tsx

### 1. Исходный файл (Ember)
```javascript
// app/initializers/local-store.js
// Дубликат addon/... с переопределением
export function initialize(appInstance) {
  // Кастомные настройки для app/
}

export default {
  name: '$(echo app-initializers-local-store.js | cut -d. -f1 | sed s/app-//g)',
  initialize,
};
```

### 2. Целевой файл (Next.js 16)
- `app/lib/setup/$(echo app-initializers-local-store.js | cut -d. -f1 | sed s/app-//g)-custom.ts` — кастомная function

### 3. Маппинг Ember → Next.js
- `app.initializer(...)` → `export function setup*` function

### 4. Зависимости
- @tanstack/react-query, react, typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/setup/`
2. Если есть отличия от addon/ — создать $file-custom.ts

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/setup/$(echo app-initializers-local-store.js | cut -d. -f1 | sed s/app-//g)-custom.ts
export function setup*Custom() {
  // Кастомные настройки для app/
}
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.ts
