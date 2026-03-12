# Миграция: специфичные сериализаторы (audit-entity, audit-field, object-type, agent, link-group, session)

## Типы Ember → Next.js
- Ember тип: serializer
- Next.js аналог: функция трансформации с кастомными правилами

### Общая информация
Специфичные сериализаторы имеют кастомные правила трансформации для конкретных моделей (audit-entity, audit-field и т.д.). В Next.js 16 они преобразуются в функции трансформации с `axios`.

### 1. Исходные файлы (Ember)
```
// addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
import ODataSerializer from './odata';

export default ODataSerializer.extend({
  // Кастомные правила для audit-entity
});

// Аналогичные файлы для:
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
// - i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/transforms/serializer-audit-entity.ts`
- `app/lib/transforms/serializer-audit-field.ts`
- `app/lib/transforms/serializer-object-type.ts`
- `app/lib/transforms/serializer-agent.ts`
- `app/lib/transforms/serializer-link-group.ts`
- `app/lib/transforms/serializer-session.ts`

### 3. Маппинг Ember → Next.js
- `ODataSerializer.extend({...})` → `export function transform<Name>Response(data)`
- Используется как основа `transformOdataResponse`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Для каждого модели создать файл с функцией `transform<Name>Response`
3. В `axiosInstance` добавить `transformResponse` с выбором функции по modelName
4. Использовать функции в запросах и ответах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-common.ts
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

/**
 * Базовые функции для специфичных сериализаторов
 */

export function transformAuditEntityResponse<T = any>(data: any): T {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const base = transformOdataResponse<T>(data);
  
  // Кастомные правила для audit-entity
  if (Array.isArray(base)) {
    return base.map(item => {
      // Пример кастомной трансформации
      if (item.Timestamp) {
        item.Timestamp = new Date(item.Timestamp);
      }
      return item;
    }) as T;
  }
  
  return base;
}

export function transformAuditFieldResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

export function transformObjectTypeResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

export function transformAgentResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

export function transformLinkGroupResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

export function transformSessionResponse<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

// Использование в axios с выбором функции по modelName
import axios from 'axios';

export const getSerializerForModel = (modelName: string) => {
  switch (modelName) {
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity':
      return transformAuditEntityResponse;
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field':
      return transformAuditFieldResponse;
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type':
      return transformObjectTypeResponse;
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent':
      return transformAgentResponse;
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group':
      return transformLinkGroupResponse;
    case 'i-c-s-soft-s-t-o-r-m-n-e-t-security-session':
      return transformSessionResponse;
    default:
      return transformOdataResponse;
  }
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.transformResponse = [
  (data, headers) => {
    // Используем заголовки или数据 для определения modelName
    const modelName = get modelName from headers || data;
    const serializer = getSerializerForModel(modelName);
    return serializer(data);
  },
  ...(axios.defaults.transformResponse as any[]),
];
```

### 7. Чек-лист валидации
- [ ] Файлы `serializer-audit-entity.ts`, `serializer-audit-field.ts`, `serializer-object-type.ts`, `serializer-agent.ts`, `serializer-link-group.ts`, `serializer-session.ts` созданы
- [ ] Используют `transformOdataResponse` как базу
- [ ] В `axiosInstance` добавлен `transformResponse` с выбором функции по modelName
- [ ] Тесты проходят для каждого специфичного сериализатора
