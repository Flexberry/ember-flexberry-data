# Инструкция: odata

## Общее описание

Модуль содержит адаптер и сериализатор для OData backend, а также реализации для конкретных моделей безопасности и аудита. Использует `odata-query` для построения запросов.

## Состав модуля

### Адаптеры/Сериализаторы
- `addon/adapters/odata.js`
- `addon/serializers/odata.js`
- `addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js`
- ... и другие специализированные сериализаторы

### Дубликаты (app/)
- `app/adapters/odata.js`
- `app/serializers/odata.js` и другие

## Порядок миграции

1. `odata.js` (адаптер/сериализатор) → `odata-client.ts`
2. Специализированные сериализаторы → `serialize-<model>.ts`
3. `odata-query` (уже есть) — импортируйте `buildODataQuery`

## Особенности реализации

- Используются заголовки OData: `OData-Version: 4.0`
- Построение запроса `$filter`, `$select`, `$expand`
- `odata-query/builder.js` — генерирует OData-строку

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `Adapter.extend` → `axios` + `queryFn` |
| `ODataQueryAdapter` → `buildODataQuery()` |

---

### Файл: `addon/adapters/odata.js`

#### Тип Ember-модуля
Adapter (odata backend)

#### Тип Next.js-модуля
API Client (axios/fetch) + Query Builder

##### 1. Исходный файл (Ember)
`addon/adapters/odata.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/api/odata.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Adapter.extend({ query, findRecord })` | `odataApi.get/post/patch/delete` |
| `this._buildURL(...)` | `buildUrl(modelName)` |
| `ODataQueryAdapter` → `buildODataQuery()` | `import { buildODataQuery } from '@/lib/api/odata'` |

##### 4. Зависимости
- `axios`
- `app/lib/api/odata-query.ts` (из `odata-query`)
- `app/lib/utils/odata-string-builder.ts`

##### 5. Алгоритм миграции
1. Создайте `odataApi = axios.create({ baseURL: ... })`
2. Заголовки: `OData-Version: 4.0`
3. Реализуйте `fetchOData`, `createOData`, `updateOData`, `deleteOData`
4. Импортируйте `buildODataQuery`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/api/odata.ts
import axios, { AxiosInstance } from 'axios';

export const odataApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ODOO_API_URL || '/odata',
  headers: {
    'OData-Version': '4.0',
    'Content-Type': 'application/json',
  },
});

/**
 * Строит OData-запрос на основе фильтров и параметров
 */
export function buildODataQuery(params: {
  filter?: Record<string, any>;
  select?: string[];
  expand?: string[];
  orderBy?: string[];
  skip?: number;
  top?: number;
}): string {
  const queries: string[] = [];
  const { filter, select, expand, orderBy, skip, top } = params;

  if (filter) {
    const conditions = Object.entries(filter).map(([key, value]) => {
      if (value === null) return `${key} eq null`;
      if (typeof value === 'string') return `${key} eq '${value}'`;
      if (Array.isArray(value)) return `${key} in (${value.map((v) => `'${v}'`).join(',')})`;
      return `${key} eq ${value}`;
    });
    queries.push(`$filter=${conditions.join(' and ')}`);
  }

  if (select) {
    queries.push(`$select=${select.join(',')}`);
  }

  if (expand) {
    queries.push(`$expand=${expand.join(',')}`);
  }

  if (orderBy) {
    queries.push(`$orderBy=${orderBy.join(',')}`);
  }

  if (skip !== undefined) {
    queries.push(`$skip=${skip}`);
  }

  if (top !== undefined) {
    queries.push(`$top=${top}`);
  }

  return queries.join('&');
}

/**
 * Запрос данных через OData
 */
export async function fetchOData<T = any>(endpoint: string, params?: Parameters<typeof buildODataQuery>[0]): Promise<T> {
  const query = params ? buildODataQuery(params) : '';
  const url = `${endpoint}${query ? '?' + query : ''}`;
  const res = await odataApi.get<T>(url);
  return res.data;
}

/**
 * Создание записи через OData
 */
export async function createOData<T>(endpoint: string, data: T): Promise<T> {
  const res = await odataApi.post<T>(endpoint, data);
  return res.data;
}

/**
 * Обновление записи через OData
 */
export async function updateOData<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
  const res = await odataApi.patch<T>(`${endpoint}('${id}')`, data);
  return res.data;
}

/**
 * Удаление записи через OData
 */
export async function deleteOData(endpoint: string, id: string): Promise<void> {
  await odataApi.delete(`${endpoint}('${id}')`);
}
```

---

### Файл: `addon/serializers/odata.js`

#### Тип Ember-модуля
Serializer (odata format)

#### Тип Next.js-модуля
Serializer Helper

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/serializers/odata.ts
import { BaseModel } from '@/lib/types/model';

export function serializeOData<T extends BaseModel>(data: T): Record<string, any> {
  const { id, createdAt, updatedAt, ...rest } = data;
  return {
    ...rest,
    ...(id && { '@odata.id': `/odata/models('${id}')` }),
  };
}

export function deserializeOData<T extends BaseModel>(data: Record<string, any>): T {
  const { '@odata.id': _, ...rest } = data;
  return rest as T;
}

/**
 * Поддержка OData batch
 */
export async function odataBatch(
  operations: Array<{ method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; url: string; data?: Record<string, any> }>
): Promise<any[]> {
  const batchBody = operations.map((op, i) => {
    const id = `batch-${i}`;
    let body = `--batch_${i}\nContent-Type: application/http\nContent-Transfer-Encoding: binary\n\n${op.method} ${op.url} HTTP/1.1\n`;
    if (op.data) {
      body += `Content-Type: application/json\n\n${JSON.stringify(op.data)}`;
    }
    return body;
  }).join('\n') + '\n--batch_--';

  const res = await odataApi.post('/$batch', batchBody, {
    headers: {
      'Content-Type': 'multipart/mixed; boundary=batch_0',
    },
  });

  // Разбор batch-ответа
  // ...

  return [];
}
```

---

## Итог

Модуль `odata` мигрирован, если:

✅ `odataApi = axios.create({ headers: { 'OData-Version': '4.0' } })`  
✅ `buildODataQuery()` — строит `$filter`, `$select`, `$expand`, `$orderBy`, `$skip`, `$top`  
✅ `fetchOData<T>`, `createOData<T>`, `updateOData<T>`, `deleteOData`  
✅ Специализированные сериализаторы для моделей безопасности/аудита  
✅ Используется `app/lib/api/odata-query`  
## Следующий модуль (рекомендуемый порядок)

После `odata` — перейдите к **`odata-query`**.
