# Миграция: guid.js

## Тип Ember → Next.js
- Ember тип: transform
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// addon/transforms/guid.js
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    return value;
  },

  deserialize(value) {
    return value;
  }
});
```

```
// app/transforms/guid.js (если есть переопределение)
// (обычно дублирует addon/transforms/guid.js)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/guid.ts` — функция трансформации

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformGUID(value, toBackend)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `guid.ts` с функцией `transformGUID`
3. В `axiosInstance` добавить `transformRequest/transformResponse` для полей типа GUID
4. Использовать функцию в `transformResponse` для преобразования GUID при получении данных
5. Использовать функцию в `transformRequest` для преобразования GUID при отправке данных

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/guid.ts
/**
 * Трансформация GUID для Ember Data → Next.js
 * @param value - значение для трансформации
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение (string)
 */
export function transformGUID(
  value: unknown,
  toBackend: boolean = false
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const strValue = String(value);

  // GUID обычно в формате xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!guidRegex.test(strValue)) {
    console.warn('Invalid GUID value:', value);
    return null;
  }

  return strValue.toLowerCase();
}

// Пример использования в axios
import axios from 'axios';
import { transformGUID } from '@/lib/transforms/guid';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.transformRequest = [
  (data) => {
    if (data && typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (key.includes('Id') || key.includes('GUID') || key.includes('Key')) {
          transformed[key] = transformGUID(data[key], true);
        } else {
          transformed[key] = data[key];
        }
      }
      return transformed;
    }
    return data;
  },
  ...(axios.defaults.transformRequest as any[]),
];

apiClient.defaults.transformResponse = [
  (data) => {
    if (data && typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (key.includes('Id') || key.includes('GUID') || key.includes('Key')) {
          transformed[key] = transformGUID(data[key], false);
        } else {
          transformed[key] = data[key];
        }
      }
      return transformed;
    }
    return data;
  },
  ...(axios.defaults.transformResponse as any[]),
];
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/transforms/guid.ts` создан с функцией `transformGUID`
- [ ] Функция валидирует GUID формат (regex)
- [ ] GUID приводится к нижнему регистру
- [ ] В `axiosInstance` добавлены `transformRequest`/`transformResponse`
- [ ] Проверены имена полей для трансформации (например, `Id`, `GUID`, `Key`)
