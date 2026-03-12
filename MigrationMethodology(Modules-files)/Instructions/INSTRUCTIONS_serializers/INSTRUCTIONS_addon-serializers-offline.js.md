# Миграция: addon/serializers/offline.js

## Тип Ember → Next.js
- Ember тип: serializer
- Next.js аналог: функция трансформации (offline response function)

### 1. Исходный файл (Ember)
```
// addon/serializers/offline.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  /* Кастомные настройки Offline сериализатора */
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/serializer-offline.ts` — функция трансформации

### 3. Маппинг Ember → Next.js
- `ODataSerializer.extend({...})` → `export function transformOfflineResponse(data)`
- Offline serializer наследует от OData

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `serializer-offline.ts` с функцией `transformOfflineResponse`
3. В `axiosInstance` добавить `transformResponse`
4. Использовать функцию в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-offline.ts
/**
 * Offline трансформация ответа
 * Ember: ODataSerializer.extend({...}) -> Next.js: transformOfflineResponse
 */
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

export function transformOfflineResponse<T = any>(data: any): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Offline response может иметь структуру без @odata.metadata
  // Используем трансформацию от OData как основу
  return transformOdataResponse<T>(data);
}

// Использование в axios
import axios from 'axios';
import { transformOfflineResponse } from '@/lib/transforms/serializer-offline';

export const offlineClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json',
  },
});

offlineClient.defaults.transformResponse = [
  (data) => transformOfflineResponse(data),
  ...(axios.defaults.transformResponse as any[]),
];
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/transforms/serializer-offline.ts` создан с функцией `transformOfflineResponse`
- [ ] Использует `transformOdataResponse` как базу
- [ ] В `offlineClient` добавлен `transformResponse`
- [ ] Тесты проходят для Offline response
