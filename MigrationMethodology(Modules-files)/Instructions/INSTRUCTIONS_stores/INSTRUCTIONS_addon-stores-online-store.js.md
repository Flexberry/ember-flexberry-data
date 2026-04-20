# Миграция: stores/online-store.js

## Тип Ember → Next.js
- Ember тип: store
- Next.js аналог: QueryClient configuration

### 1. Исходный файл (Ember)
\`\`\`javascript
// addon/stores/online-store.js
import Store from './base-store';

export default Store.extend({
  // Логика онлайн store
});
\`\`\`

### 2. Целевой файл (Next.js 16)
- \`app/lib/store/online-store.ts\` — function

### 3. Маппинг Ember → Next.js
- \`Store.extend(...)\` → \`export function createOnlineStore()\` function

### 4. Зависимости
- @tanstack/react-query, react, typescript

### 5. Алгоритм миграции
1. Создать папку \`app/lib/store/\`
2. Создать файл с функцией \`createOnlineStore\`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
\`\`\`typescript
// app/lib/store/online-store.ts
import { QueryClient } from '@tanstack/react-query';

export function createOnlineStore() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60000 },
    },
  });
}
\`\`\`

### 7. Чек-лист валидации
- [ ] Файл создан
- [ ] Function работает корректно
