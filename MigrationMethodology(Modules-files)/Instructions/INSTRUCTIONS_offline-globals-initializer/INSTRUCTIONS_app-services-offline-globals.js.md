# Инструкция по миграции: app/services/offline-globals.js

## 📋 Тип Ember-модуля
- **Ember тип:** service (переопределение)
- **Next.js тип:** React Context (переопределение)

## 📁 Исходный файл (Ember)
```
// app/services/offline-globals.js
// Дубликат addon/services/offline-globals.js
import Service from '@ember/service';

export default Service.extend({
  // Кастомные настройки для app/
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/contexts/offline-globals-custom.tsx` — кастомный context

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/contexts/offline-globals-custom.tsx
import { createContext, useContext, useState, useEffect } from 'react';

export interface OfflineGlobalsContextType {
  isOnline: boolean;
}

const OfflineGlobalsContext = createContext<OfflineGlobalsContextType | undefined>(undefined);

export function OfflineGlobalsProviderCustom({ children }: { children: React.ReactNode }) {
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

export function useOfflineGlobalsCustom() {
  const context = useContext(OfflineGlobalsContext);
  if (!context) {
    throw new Error('useOfflineGlobalsCustom must be used within OfflineGlobalsProviderCustom');
  }
  return context;
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `offline-globals-custom.tsx`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
