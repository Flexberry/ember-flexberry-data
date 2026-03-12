# Миграция: flexberry-enum.js

## Тип Ember → Next.js
- Ember тип: transform
- Next.js аналог: функция преобразования enum (transform function + enum type)

### 1. Исходный файл (Ember)
```
// addon/transforms/flexberry-enum.js
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.value || value;
  },

  deserialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return { value: value };
  }
});
```

```
// app/transforms/flexberry-enum.js (если есть переопределение)
// (обычно дублирует addon/transforms/flexberry-enum.js)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/flexberry-enum.ts` — функция трансформации
- `app/lib/types/enum.ts` — тип FlexberryEnum

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformFlexberryEnum(value, toBackend)`
- TypeScript тип `FlexberryEnum`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `flexberry-enum.ts` с функцией `transformFlexberryEnum`
3. Создать тип `FlexberryEnum` в `app/lib/types/enum.ts`
4. В `axiosInstance` добавить `transformRequest/transformResponse`
5. Использовать функцию в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/enum.ts
export interface FlexberryEnum {
  value: string | number;
}

// app/lib/transforms/flexberry-enum.ts
import { FlexberryEnum } from '@/lib/types/enum';

/**
 * Трансформация FlexberryEnum для Ember Data → Next.js
 * @param value - значение для трансформации
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение
 */
export function transformFlexberryEnum(
  value: unknown,
  toBackend: boolean = false
): FlexberryEnum | string | number | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Если приходит Ember Enum object {value: 'xxx'}
  if (value && typeof value === 'object' && 'value' in value) {
    if (toBackend) {
      return value.value;
    }
    return value;
  }

  // Если приходит строка/число из Backend
  if (toBackend) {
    return String(value) === 'null' || String(value) === 'undefined' ? null : value;
  }

  return { value: value };
}

// Пример использования в axios
import axios from 'axios';
import { transformFlexberryEnum } from '@/lib/transforms/flexberry-enum';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.transformRequest = [
  (data) => {
    if (data && typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (key.endsWith('ExecutionVariant') || key.endsWith('TypeOfAuditOperation')) {
          transformed[key] = transformFlexberryEnum(data[key], true);
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
        if (key.endsWith('ExecutionVariant') || key.endsWith('TypeOfAuditOperation')) {
          transformed[key] = transformFlexberryEnum(data[key], false);
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
- [ ] Файл `app/lib/transforms/flexberry-enum.ts` создан с функцией `transformFlexberryEnum`
- [ ] Тип `FlexberryEnum` создан в `app/lib/types/enum.ts`
- [ ] Функция обрабатывает Ember Enum object и primitive value
- [ ] В `axiosInstance` добавлены `transformRequest`/`transformResponse`
- [ ] Проверены имена полей для трансформации (например, `*ExecutionVariant`, `*TypeOfAuditOperation`)
