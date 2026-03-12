# Миграция: mixin/regenerated/models/[model].js (6 файлов)

## Общая информация
Сгенерированные mixins для моделей: audit-entity, audit-field, object-type, agent, link-group, session.

### 1. Исходный файл (Ember)
```
// addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Автоматически сгенерированная логика
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useAuditEntityMixin.ts`, `useAuditFieldMixin.ts`, etc.

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function use<Model>Mixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Для каждого mixin создать файл с hook

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useAuditEntityMixin.ts
export function useAuditEntityMixin() {
  // Implementation
}

// Аналогично для других моделей
```

### 7. Чек-лист валидации
- [ ] Файлы `use*Mixin.ts` созданы
- [ ] Hook'и работают корректно
