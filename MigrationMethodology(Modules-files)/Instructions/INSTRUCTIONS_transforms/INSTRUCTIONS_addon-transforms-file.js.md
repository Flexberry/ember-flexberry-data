# Миграция: file.js

## Тип Ember → Next.js
- Ember тип: transform
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// addon/transforms/file.js
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(file) {
    if (!file) return null;
    return {
      name: file.get('name'),
      url: file.get('url'),
      size: file.get('size'),
      type: file.get('type'),
    };
  },

  deserialize(data) {
    if (!data) return null;
    return {
      name: data.name,
      url: data.url,
      size: data.size,
      type: data.type,
    };
  }
});
```

```
// app/transforms/file.js (если есть переопределение)
// (обычно дублирует addon/transforms/file.js)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/file.ts` — функция трансформации
- `app/lib/types/file.ts` — тип File

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformFile(value, toBackend)`
- TypeScript interface для File

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл `file.ts` с функцией `transformFile`
3. Создать тип `File` в `app/lib/types/file.ts`
4. В `axiosInstance` добавить `transformRequest/transformResponse`
5. Использовать функцию в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/file.ts
export interface File {
  name: string;
  url: string;
  size: number;
  type: string;
}

// app/lib/transforms/file.ts
import { File } from '@/lib/types/file';

/**
 * Трансформация File для Ember Data → Next.js
 * @param value - значение для трансформации (File или object)
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение
 */
export function transformFile(
  value: unknown,
  toBackend: boolean = false
): File | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Если приходит Ember File model
  if (value && typeof value === 'object' && 'get' in value && typeof value.get === 'function') {
    return {
      name: String(value.get('name') || ''),
      url: String(value.get('url') || ''),
      size: Number(value.get('size') || 0),
      type: String(value.get('type') || ''),
    };
  }

  // Если приходит object из Backend
  if (typeof value === 'object' && value !== null) {
    const res: File = {
      name: String(value.name || ''),
      url: String(value.url || ''),
      size: Number(value.size || 0),
      type: String(value.type || ''),
    };
    return res;
  }

  // Если приходит строка (URL) — возвращаем объект с URL
  if (typeof value === 'string') {
    return {
      name: value.split('/').pop() || '',
      url: value,
      size: 0,
      type: 'application/octet-stream',
    };
  }

  return null;
}

// Пример использования в axios
import axios from 'axios';
import { transformFile } from '@/lib/transforms/file';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.transformRequest = [
  (data) => {
    if (data && typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (key.endsWith('File') || key.endsWith('Attachment')) {
          transformed[key] = transformFile(data[key], true);
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
        if (key.endsWith('File') || key.endsWith('Attachment')) {
          transformed[key] = transformFile(data[key], false);
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
- [ ] Файл `app/lib/transforms/file.ts` создан с функцией `transformFile`
- [ ] Тип `File` создан в `app/lib/types/file.ts`
- [ ] Функция обрабатывает Ember File model, object и string
- [ ] В `axiosInstance` добавлены `transformRequest`/`transformResponse`
- [ ] Проверены имена полей для трансформации (например, `*File`, `*Attachment`)
