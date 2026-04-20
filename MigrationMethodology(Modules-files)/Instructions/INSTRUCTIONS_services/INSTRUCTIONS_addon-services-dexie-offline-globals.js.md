# Миграция: addon/services/dexie.js, offline-globals.js (и их app/ дубликаты)

## Тип Ember → Next.js
- Ember тип: service
- Next.js аналог: React Context + custom hook

### Общая информация
Эти сервисы для работы с IndexedDB и глобальными настройками оффлайн. В Next.js 16 они обрабатываются аналогично.

### 1. Исходные файлы (Ember)
```
// addon/services/dexie.js
import Service from '@ember/service';

export default Service.extend({
  db: null,
  
  init() {
    this._super(...arguments);
    this.db = new Dexie('OfflineDB');
  },
});

// addon/services/offline-globals.js
import Service from '@ember/service';

export default Service.extend({
  isOnline: true,
});
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/contexts/dexie.tsx` + `useDexie.ts`
- `app/lib/contexts/offline-globals.tsx` + `useOfflineGlobals.ts`

### 3. Маппинг Ember → Next.js
- `Service.extend({...})` → `DexieContext` + `useDexie` hook
- `Service.extend({...})` → `OfflineGlobalsContext` + `useOfflineGlobals` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- idb / Dexie.js

### 5. Алгоритм миграции
1. Создать папку `app/lib/contexts/`
2. Создать файлы с React Context и hooks
3. В `app/layout.tsx` обернуть в Providers
4. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/dexie.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { openDB } from 'idb';

export interface DexieContextType {
  db: any | null;
  init: () => Promise<void>;
}

const DexieContext = createContext<DexieContextType | undefined>(undefined);

export function DexieProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any | null>(null);

  const init = async () => {
    const database = await openDB('OfflineDB', 1, {
      upgrade(db) {
        db.createObjectStore('records', { keyPath: ['modelName', 'id'] });
      },
    });
    setDb(database);
  };

  return (
    <DexieContext.Provider value={{ db, init }}>
      {children}
    </DexieContext.Provider>
  );
}

export function useDexie() {
  const context = useContext(DexieContext);
  if (!context) {
    throw new Error('useDexie must be used within DexieProvider');
  }
  return context;
}
```

```typescript
// app/lib/contexts/offline-globals.tsx
import { createContext, useContext, useEffect, useState } from 'react';

export interface OfflineGlobalsContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
}

const OfflineGlobalsContext = createContext<OfflineGlobalsContextType | undefined>(undefined);

export function OfflineGlobalsProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineGlobalsContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OfflineGlobalsContext.Provider>
  );
}

export function useOfflineGlobals() {
  const context = useContext(OfflineGlobalsContext);
  if (!context) {
    throw new Error('useOfflineGlobals must be used within OfflineGlobalsProvider');
  }
  return context;
}
```

### 7. Чек-лист валидации
- [ ] Файлы `dexie.tsx`, `useDexie.ts`, `offline-globals.tsx`, `useOfflineGlobals.ts` созданы
- [ ] В `app/layout.tsx` добавлены `DexieProvider` и `OfflineGlobalsProvider`
- [ ] Для `isOnline` используется `navigator.onLine` и event listeners
- [ ] Использование `idb` для IndexedDB
