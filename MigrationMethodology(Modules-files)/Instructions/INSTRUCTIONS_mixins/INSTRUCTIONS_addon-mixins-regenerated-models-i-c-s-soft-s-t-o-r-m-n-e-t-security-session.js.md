# Миграция: mixin/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```javascript
// addon/mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Логика для regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useregenerated-models-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Mixin.create\{\.\.\.\}` → `export function useregenerated-models-i-c-s-soft-s-t-o-r-m-n-e-t-security-sessionMixin()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useregenerated-models-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts` с hook

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useregenerated-models-i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts
export function useregenerated-models-i-c-s-soft-s-t-o-r-m-n-e-t-security-sessionMixin() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл created
- [ ] Hook works correctly
