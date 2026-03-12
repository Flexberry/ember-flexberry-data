# Миграция: адаптеры (odata, offline) — дубликаты

## Общая информация
Дубликаты адаптеров в `app/adapters/`.

## Файлы
- `app/adapters/odata.js` ↔ `addon/adapters/odata.js`
- `app/adapters/offline.js` ↔ `addon/adapters/offline.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/odata.ts (если переопределение не требуется)
// Используется та же функция из addon/adapters/odata.js

// Если требуется кастомное поведение в app/:
// app/lib/api/odata-custom.ts
import axios from 'axios';

const odataApiCustom = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/odata',
  timeout: 30000,
});

export const odataApiCustom = {
  query: async <T>(modelName: string, query: any): Promise<T[]> => {
    const response = await odataApiCustom.get<T[]>(`/${modelName}`, { params: query });
    return response.data;
  },
  // ... другие методы
};
```

### Чек-лист
- [ ] Проверено: `app/adapters/...` и `addon/adapters/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
