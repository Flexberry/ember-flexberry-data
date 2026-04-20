# Миграция: service/app/services/dexie.js

## Тип Ember → Next.js
- Ember тип: service (переопределение)
- Next.js аналог: React Context + custom hook

### 1. Исходный файл (Ember)
```javascript
// app/services/dexie.js
// Дубликат addon/... с переопределением
import Service from '../services/user';

export default Service.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/contexts/$(echo app-services-dexie.js | cut -d. -f1)-custom.tsx` — кастомный Context

### 3. Маппинг Ember → Next.js
- `Service.extend(...)` → `export function use*` hook

### 4. Зависимости
- @tanstack/react-query, react, typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/contexts/`
2. Если есть отличия от addon/ — создать $file-custom.tsx

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/$(echo app-services-dexie.js | cut -d. -f1 | sed s/app-//g)-custom.tsx
import { createContext, useContext } from 'react';

const ServiceCustomContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceCustomProvider({ children }: { children: React.ReactNode }) {
  return <ServiceCustomContext.Provider value={...}>{children}</ServiceCustomContext.Provider>;
}

export function useServiceCustom() {
  const context = useContext(ServiceCustomContext);
  if (!context) {
    throw new Error('useServiceCustom must be used within ServiceCustomProvider');
  }
  return context;
}
```

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен *-custom.tsx
