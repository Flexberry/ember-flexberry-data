# Миграция: app/ services (дубликаты)

## Тип Ember → Next.js
- Ember тип: service (переопределение)
- Next.js аналог: React Context + custom hook

### Общая информация
Файлы в `app/services/` дублируют `addon/services/` с потенциальными переопределениями.

### 1. Исходные файлы (Ember)
```
// app/services/user.js
// Обычно дублирует addon/services/user.js с переопределением
import Service from '../services/user';

export default Service.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/contexts/*-custom.tsx` — кастомные контексты (если требуется переопределение)
- `app/lib/hooks/use*Custom.ts` — кастомные hooks

### 3. Маппинг Ember → Next.js
- `Service.extend({...})` → `Context` + `use*` hook
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Сравнить `app/services/...` и `addon/services/...`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомные контексты и hooks

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/user.tsx (если переопределение не требуется)
// Используется та же функция из addon/services/...

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

### 7. Чек-лист валидации
- [ ] Проверено: `app/services/...` и `addon/services/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.tsx`/`*-custom.ts`
