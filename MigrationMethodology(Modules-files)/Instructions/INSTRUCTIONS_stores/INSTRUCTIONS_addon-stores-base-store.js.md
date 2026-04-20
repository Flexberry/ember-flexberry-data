# Инструкция по миграции: addon/stores/base-store.js

## 📋 Тип Ember-модуля
- **Ember тип:** store
- **Next.js тип:** React Context + hook

## 📁 Исходный файл (Ember)
```
// addon/stores/base-store.js
import Store from '@ember-data/store';

export default Store.extend({
  // Base store logic
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/contexts/store.tsx` — React Context
- `app/lib/hooks/useStore.ts` — custom hook

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/contexts/store.tsx
import { createContext, useContext } from 'react';
import { QueryClient } from '@tanstack/react-query';

export interface StoreContextType {
  queryClient: QueryClient;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return (
    <StoreContext.Provider value={{ queryClient }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/contexts/store.tsx` создан
- [ ] Файл `app/lib/hooks/useStore.ts` создан
- [ ] `StoreProvider` обернут в `app/layout.tsx`
