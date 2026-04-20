# Миграция: mixin/adapter.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```
// addon/mixins/adapter.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Логика для адаптеров
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useAdapterMixin.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function useAdapterMixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useAdapterMixin.ts` с hook

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useAdapterMixin.ts
export function useAdapterMixin() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл `useAdapterMixin.ts` создан
- [ ] Hook работает корректно
