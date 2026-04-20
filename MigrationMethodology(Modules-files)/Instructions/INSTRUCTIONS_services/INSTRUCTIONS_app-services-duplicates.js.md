# Миграция: service (user, syncer, dexie, offline-globals) — дубликаты

## Общая информация
Дубликаты services в `app/services/`.

## Файлы
- `app/services/user.js` ↔ `addon/services/user.js`
- `app/services/syncer.js` ↔ `addon/services/syncer.js`
- `app/services/dexie.js` ↔ `addon/services/dexie.js`
- `app/services/offline-globals.js` ↔ `addon/services/offline-globals.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.tsx`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/user.tsx (если переопределение не требуется)
// Используется та же функция из addon/services/user.js

// Если требуется кастомное поведение в app/:
// app/lib/contexts/user-custom.tsx
import { createContext, useContext } from 'react';

const UserCustomContext = createContext<UserContextType | undefined>(undefined);

export function UserCustomProvider({ children }: { children: React.ReactNode }) {
  // Кастомная логика
  return <UserCustomContext.Provider value={...}>{children}</UserCustomContext.Provider>;
}

export function useUserCustom() {
  const context = useContext(UserCustomContext);
  if (!context) {
    throw new Error('useUserCustom must be used within UserCustomProvider');
  }
  return context;
}
```

### Чек-лист
- [ ] Проверено: `app/services/...` и `addon/services/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.tsx`
