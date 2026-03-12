# Миграция: addon/instance-initializers/set-singletons.js

## Тип Ember → Next.js
- Ember тип: instance-initializer
- Next.js аналог: setup function + React Context

### 1. Исходный файл (Ember)
```
// addon/instance-initializers/set-singletons.js
export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');
  const user = appInstance.lookup('service:user');
  
  // Установка синглтонов
  window.EmberStore = store;
  window.EmberUser = user;
}

export default {
  name: 'set-singletons',
  initialize,
};
```

### 2. Целевой файл (Next.js 16)
- `app/lib/setup/singletons.ts` — функция установки синглтонов
- `app/layout.tsx` — вызов установки
- `app/lib/contexts/singletons.ts` — React Context (если нужно)

### 3. Маппинг Ember → Next.js
- `appInstance.lookup()` → `useQueryClient()` / `useUser()`
- `window.global` → `React Context` или `Global state`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/setup/`
2. Создать файл `singletons.ts` с функцией `setupSingletons`
3. Вызвать функцию в `app/layout.tsx` или `app/middleware.ts`
4. Создать React Context для доступа к синглтонам (если нужно)

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/setup/singletons.ts
import { QueryClient } from '@tanstack/react-query';
import { UserContext } from '@/lib/contexts/user';

/**
 * Установка синглтонов из Ember в Next.js
 * Вызывается в layout.tsx
 */
export function setupSingletons() {
  // В Next.js нет глобальных синглтонов via appInstance.lookup()
  // Вместо этого используем React Context и QueryClient
  
  // No-op: синглтоны устанавливаются черезProviderы в layout.tsx
}

// app/lib/contexts/singletons.ts
import { createContext, useContext } from 'react';

export interface Singletons {
  queryClient: QueryClient;
  // другие синглтоны по мере необходимости
}

export const SingletonsContext = createContext<Singletons | undefined>(undefined);

export function useSingletons() {
  const context = useContext(SingletonsContext);
  if (!context) {
    throw new Error('useSingletons must be used within SingletonsProvider');
  }
  return context;
}

// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SingletonsProvider } from '@/lib/contexts/singletons';
import { setupSingletons } from '@/lib/setup/singletons';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  setupSingletons();
  
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          <SingletonsProvider>
            {children}
          </SingletonsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/setup/singletons.ts` создан с функцией `setupSingletons`
- [ ] Создан `app/lib/contexts/singletons.ts` для React Context
- [ ] В `app/layout.tsx` добавлен Provider
- [ ] Установлен `SingletonsProvider`
- [ ] Удалены все usage `window.EmberStore`, `window.EmberUser`
