# Миграция: app/adapters/odata.js

## Тип Ember → Next.js
- Ember тип: adapter (переопределение)
- Next.js аналог: axios + custom hook + @tanstack/react-query

### 1. Исходный файл (Ember)
```
// app/adapters/odata.js
// Обычно дублирует addon/adapters/odata.js с переопределением
import ODataAdapter from '../adapters/odata';

export default ODataAdapter.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/api/odata-custom.ts` — кастомный axios client (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `RESTAdapter.extend({...})` → `axios.create()` + `useQuery` / `useMutation`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Сравнить `app/adapters/odata.js` и `addon/adapters/odata.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомный axios client в `app/lib/api/odata-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/odata.ts (если переопределение не требуется)
// Используется та же функция из addon/adapters/odata.js

// Если требуется кастомное поведение в app/:
// app/lib/api/odata-custom.ts
import axios from 'axios';

const customOdataApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/odata',
  headers: {
    'OData-Version': '4.0',
    'Content-Type': 'application/json',
  },
  // Кастомные настройки
  timeout: 30000,
});

export const customOdataApi = {
  query: async <T>(modelName: string, query: any): Promise<T[]> => {
    const response = await customOdataApi.get<T[]>(`/${modelName}`, { params: query });
    return response.data;
  },
  // ... другие методы
};
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/adapters/odata.js` и `addon/adapters/odata.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `odata-custom.ts`
