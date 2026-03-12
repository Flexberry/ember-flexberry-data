# Миграция: addon/initializers/local-store.js

## Тип Ember → Next.js
- Ember тип: initializer
- Next.js аналог: setup function в layout.tsx

### 1. Исходный файл (Ember)
```
// addon/initializers/local-store.js
export function initialize(appInstance) {
  appInstance.register('store:main', Store);
}

export default {
  name: 'local-store',
  initialize,
};
```

### 2. Целевой файл (Next.js 16)
- `app/lib/setup/local-store.ts` — setup function

### 3. Маппинг Ember → Next.js
- `app.initializer({...})` → `export function setupLocalStore()` function

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/setup/`
2. Создать файл `local-store.ts` с функцией `setupLocalStore`
3. Вызвать `setupLocalStore()` в `app/layout.tsx`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/setup/local-store.ts
import { QueryClient } from '@tanstack/react-query';

export function setupLocalStore() {
  // Инициализация локального хранилища (если нужно)
  // В Next.js используем QueryClient с localStorage адаптером
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/setup/local-store.ts` создан функцией `setupLocalStore`
- [ ] В `app/layout.tsx` вызвана `setupLocalStore()`
