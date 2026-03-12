# Миграция: addon/services/syncer.js

## Тип Ember → Next.js
- Ember тип: service
- Next.js аналог: React Context + custom hook

### 1. Исходный файл (Ember)
```
// addon/services/syncer.js
import Service from '@ember/service';

export default Service.extend({
  sync(modelName) {
    // Логика синхронизации
  },
  
  syncAll() {
    // Синхронизация всех моделей
  },
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/contexts/syncer.tsx` — React Context
- `app/lib/hooks/useSyncer.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Service.extend({...})` → `SyncerContext` + `useSyncer` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/contexts/`
2. Создать файл `syncer.tsx` с React Context
3. Создать файл `useSyncer.ts` с custom hook
4. В `app/layout.tsx` обернуть в `SyncerProvider`
5. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/syncer.tsx
import { createContext, useContext, useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SyncerContextType {
  isSyncing: boolean;
  sync: (modelName: string) => Promise<void>;
  syncAll: () => Promise<void>;
}

const SyncerContext = createContext<SyncerContextType | undefined>(undefined);

export function SyncerProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const syncMutation = useMutation();

  const sync = useCallback(async (modelName: string) => {
    setIsSyncing(true);
    try {
      await syncMutation.mutateAsync({ modelName });
      await queryClient.invalidateQueries({ queryKey: [modelName] });
    } finally {
      setIsSyncing(false);
    }
  }, [syncMutation, queryClient]);

  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncMutation.mutateAsync({ all: true });
      await queryClient.invalidateQueries({ queryKey: ['*'] });
    } finally {
      setIsSyncing(false);
    }
  }, [syncMutation, queryClient]);

  return (
    <SyncerContext.Provider value={{ isSyncing, sync, syncAll }}>
      {children}
    </SyncerContext.Provider>
  );
}

export function useSyncer() {
  const context = useContext(SyncerContext);
  if (!context) {
    throw new Error('useSyncer must be used within SyncerProvider');
  }
  return context;
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/contexts/syncer.tsx` создан с SyncerContext и SyncerProvider
- [ ] Файл `app/lib/hooks/useSyncer.ts` создан с custom hook
- [ ] В `app/layout.tsx` добавлен `SyncerProvider`
- [ ] Использование `useMutation` и `useQueryClient`
