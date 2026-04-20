# Миграция: mixin/store.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```
// addon/mixins/store.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Логика для store
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useStoreMixin.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function useStoreMixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useStoreMixin.ts` с hook

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useStoreMixin.ts
export function useStoreMixin() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл `useStoreMixin.ts` создан
- [ ] Hook работает корректно
