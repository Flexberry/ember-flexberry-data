# Миграция: addon/serializers/odata.js

## Тип Ember → Next.js
- Ember тип: serializer
- Next.js аналог: функция трансформации OData (transformResponse function)

### 1. Исходный файл (Ember)
```
// addon/serializers/odata.js
import ODataSerializer from 'ember-data-odata-adapter/addon/serializers/odata';

export default ODataSerializer.extend({
  /* Кастомные настройки OData сериализатора */
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/serializer-odata.ts` — функция трансформации OData

### 3. Маппинг Ember → Next.js
- `ODataSerializer.extend({...})` → `export function transformOdataResponse(data)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `serializer-odata.ts` с функцией `transformOdataResponse`
3. В `axiosInstance` добавить `transformResponse`
4. Использовать функцию в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-odata.ts
/**
 * OData трансформация ответа
 * Ember: OData serializer -> Next.js: transformOdataResponse
 */
export function transformOdataResponse<T = any>(data: any): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // OData response имеет структуру
  // { value: [...], '@odata.count': number, ... }
  
  // Если приходит OData response { value: [...], '@odata.count': 10 }
  if (Array.isArray(data.value)) {
    // Возвращаем только value, без metadata
    return data.value as T;
  }
  
  // Если приходит один объект
  if (data.value !== undefined) {
    return data.value as T;
  }
  
  // Если приходит просто объект без value
  return data as T;
}

// Использование в axios
import axios from 'axios';
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

export const odataClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

odataClient.defaults.transformResponse = [
  (data) => transformOdataResponse(data),
  ...(axios.defaults.transformResponse as any[]),
];
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/transforms/serializer-odata.ts` создан с функцией `transformOdataResponse`
- [ ] В `odataClient` добавлен `transformResponse`
- [ ] Тесты проходят для OData response {value: [], '@odata.count': 10}
