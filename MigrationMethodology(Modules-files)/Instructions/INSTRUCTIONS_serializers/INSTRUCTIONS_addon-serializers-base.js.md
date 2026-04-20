# Миграция: addon/serializers/base.js

## Тип Ember → Next.js
- Ember тип: serializer
- Next.js аналог: функция трансформации (transformResponse function)

### 1. Исходный файл (Ember)
```
// addon/serializers/base.js
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  /* Кастомные настройки базового сериализатора */
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/serializer-base.ts` — функция трансформации

### 3. Маппинг Ember → Next.js
- `JSONAPISerializer.extend({...})` → `export function transformBaseResponse(data)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `serializer-base.ts` с функцией `transformBaseResponse`
3. В `axiosInstance` добавить `transformResponse`
4. Использовать функцию в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-base.ts
/**
 * Базовая трансформация ответа для JSONAPI
 * Ember: base serializer -> Next.js: transformBaseResponse
 */
export function transformBaseResponse<T = any>(data: any): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Простая трансформация JSONAPI без драматических изменений структуры
  // В реальном проекте могут потребоваться более сложные правила

  // Если приходит JSONAPI response { data: {...} }
  if (data.data) {
    return data.data as T;
  }

  // Если приходит просто объект
  return data as T;
}

// Использование в axios
import axios from 'axios';
import { transformBaseResponse } from '@/lib/transforms/serializer-base';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.transformResponse = [
  (data) => transformBaseResponse(data),
  ...(axios.defaults.transformResponse as any[]),
];
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/transforms/serializer-base.ts` создан с функцией `transformBaseResponse`
- [ ] В `axiosInstance` добавлен `transformResponse`
- [ ] Тесты проходят для базового JSONAPI response
