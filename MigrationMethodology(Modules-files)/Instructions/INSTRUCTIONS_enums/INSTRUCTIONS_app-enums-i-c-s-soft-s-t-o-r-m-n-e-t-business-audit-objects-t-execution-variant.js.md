# Миграция: enum/app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js

## Тип Ember → Next.js
- Ember тип: enum (переопределение)
- Next.js аналог: TypeScript const object

### 1. Исходный файл (Ember)
```javascript
// app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
// Дубликат addon/... с переопределением
export default EmberObject.freeze({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/enums/$(echo app-enums-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js | cut -d. -f1 | sed s/app-//g)-custom.ts` — кастомный const

### 3. Маппинг Ember → Next.js
- `EmberObject.freeze(...)` → `export const * = {...} as const`

### 4. Зависимости
- typescript, react

### 5. Алгоритм миграции
1. Создать папку `app/lib/enums/`
2. Если есть отличия от addon/ — создать $file-custom.ts

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/enums/$(echo app-enums-i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js | cut -d. -f1 | sed s/app-//g)-custom.ts
export const *Custom = {
  // Кастомные значения
} as const;
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.ts
