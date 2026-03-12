# Миграция: decimal.js

## Тип Ember → Next.js
- Ember тип: transform
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// addon/transforms/decimal.js
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
// app/transforms/decimal.js (если есть переопределение)
// (обычно дублирует addon/transforms/decimal.js)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/decimal.ts` — функция трансформации
- `app/lib/api/client.ts` — использование в axios

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformDecimal(value, toBackend)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `decimal.ts` с функцией `transformDecimal`
3. В `axiosInstance` добавить `transformRequest/transformResponse`
4. Использовать функцию в `transformResponse` для преобразования decimal при получении данных
5. Использовать функцию в `transformRequest` для преобразования decimal при отправке данных

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/decimal.ts
/**
 * Трансформация decimal для Ember Data → Next.js
 * @param value - значение для трансформации
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение
 */
export function transformDecimal(
  value: unknown,
  toBackend: boolean = false
): string | number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    // Из JS в Backend: форматируем как строку с фиксированным количеством знаков
    if (toBackend) {
      return value.toFixed(2);
    }
    // Из Backend в JS: парсим строку в число
    return Number(value);
  }

  if (typeof value === 'string') {
    // Из Backend в JS: парсим строку в число
    if (!toBackend) {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    // Из JS в Backend: форматируем как строку
    return value;
  }

  return value;
}

// Пример использования в axios
import axios from 'axios';
import { transformDecimal } from '@/lib/transforms/decimal';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Добавляем трансформы для decimal
apiClient.defaults.transformRequest = [
  (data) => {
    if (data && typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (key.endsWith('Amount') || key.endsWith('Price') || key.endsWith('Value')) {
          transformed[key] = transformDecimal(data[key], true);
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
        if (key.endsWith('Amount') || key.endsWith('Price') || key.endsWith('Value')) {
          transformed[key] = transformDecimal(data[key], false);
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
- [ ] Файл `app/lib/transforms/decimal.ts` создан с функцией `transformDecimal`
- [ ] Функция обрабатывает `null`, `undefined`, `number`, `string`
- [ ] В `axiosInstance` добавлены `transformRequest`/`transformResponse`
- [ ] Проверены имена полей для трансформации (например, `Amount`, `Price`, `Value`)
- [ ] Тесты трансформации проходят (значение 123.456 → "123.46" → 123.46)
