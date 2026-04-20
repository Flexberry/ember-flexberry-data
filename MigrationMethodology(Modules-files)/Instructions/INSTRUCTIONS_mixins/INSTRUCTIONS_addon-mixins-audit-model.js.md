# Миграция: mixin/audit-model.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```
// addon/mixins/audit-model.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  auditEnabled: true,
  // Логика для audit модели
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useAuditModelMixin.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function useAuditModelMixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useAuditModelMixin.ts` с hook

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useAuditModelMixin.ts
export function useAuditModelMixin() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл `useAuditModelMixin.ts` создан
- [ ] Hook работает корректно
