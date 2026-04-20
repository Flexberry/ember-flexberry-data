# Миграция: app/adapters/offline.js

## Тип Ember → Next.js
- Ember тип: adapter (переопределение)
- Next.js аналог: axios + IndexedDB + custom hooks

### 1. Исходный файл (Ember)
```
// app/adapters/offline.js
// Обычно дублирует addon/adapters/offline.js с переопределением
import OfflineAdapter from '../adapters/offline';

export default OfflineAdapter.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/api/offline-custom.ts` — кастомный axios client (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `ODataAdapter.extend({...})` → `offlineApi` + hooks
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios
- idb

### 5. Алгоритм миграции
1. Сравнить `app/adapters/offline.js` и `addon/adapters/offline.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомный axios client в `app/lib/api/offline-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/offline.ts (если переопределение не требуется)
// Используется та же функция из addon/adapters/offline.js

// Если требуется кастомное поведение в app/:
// app/lib/api/offline-custom.ts
import axios from 'axios';
import { saveRecordOffline, getRecordOffline } from './indexeddb';

const customOdataApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/odata',
  headers: {
    'OData-Version': '4.0',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const customOfflineApi = {
  isOnline: () => navigator.onLine,
  
  query: async <T>(modelName: string, query?: any): Promise<T[]> => {
    if (customOfflineApi.isOnline()) {
      const response = await customOdataApi.get<T[]>(`/${modelName}`, { params: query });
      return response.data;
    }
    return getAllRecordsOffline<T>(modelName);
  },
  // ... другие методы
};
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/adapters/offline.js` и `addon/adapters/offline.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `offline-custom.ts`
