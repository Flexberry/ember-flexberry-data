# Инструкция по миграции: addon/services/offline-globals.js

## 📋 Тип Ember-модуля
- **Ember тип:** service
- **Next.js тип:** React Context + hook

## 📁 Исходный файл (Ember)
```
// addon/services/offline-globals.js
import Service from '@ember/service';

export default Service.extend({
  isOnline: true,
  
  init() {
    this._super(...arguments);
    window.addEventListener('online', () => this.set('isOnline', true));
    window.addEventListener('offline', () => this.set('isOnline', false));
  }
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/contexts/offline-globals.tsx` — React Context
- `app/lib/hooks/useOfflineGlobals.ts` — custom hook

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/contexts/offline-globals.tsx
import { createContext, useContext, useState, useEffect } from 'react';

export interface OfflineGlobalsContextType {
  isOnline: boolean;
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
    <OfflineGlobalsContext.Provider value={{ isOnline }}>
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

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/contexts/offline-globals.tsx` создан
- [ ] Файл `app/lib/hooks/useOfflineGlobals.ts` создан
- [ ] `OfflineGlobalsProvider` обернут в `app/layout.tsx`
