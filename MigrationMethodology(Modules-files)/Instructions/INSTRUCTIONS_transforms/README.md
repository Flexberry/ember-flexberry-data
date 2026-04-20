# Миграция модуля transforms

## Общая информация
Модуль `transforms` содержит преобразователи типов для Ember Data. В Next.js 16 они преобразуются в функции преобразования данных, которые используются вместе с `axios` и `@tanstack/react-query`.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Transform | TypeScript function для transformRequest/transformResponse в axios |

## Связи между файлами
Нет зависимостей между файлами модуля transforms. Все трансформы изолированы и работают независимо.

## Порядок миграции внутри модуля
1. `decimal.js` — базовая трансформация decimal
2. `guid.js` — базовая трансформация guid
3. `file.js` — базовая трансформация file
4. `flexberry-enum.js` — трансформация enum (требует знания enum структуры)
5. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` — специфичные трансформы
6. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` — специфичные трансформы

## Как использовать в Next.js
Для каждого трансформа создать функцию в папке `app/lib/transforms/`.

В `axios` использовать `transformRequest`/`transformResponse` для преобразования данных при запросе/ответе.

Пример подключения в axios:
```typescript
import { decimalTransform } from '@/lib/transforms/decimal';

const axiosInstance = axios.create({
  transformRequest: [(data) => decimalTransform(data)],
  transformResponse: [(data) => decimalTransform(data, true)],
});
```

## Типы трансформов в Ember → Next.js
| Ember Transform | Next.js Function |
|----------------|------------------|
| `DecimalTransform` | `transformDecimal(value, toBackend)` |
| `GUIDTransform` | `transformGUID(value, toBackend)` |
| `FileTransform` | `transformFile(value, toBackend)` |
| `FlexberryEnumTransform` | `transformFlexberryEnum(value, toBackend)` |

## Файлы модуля
- addon/transforms/decimal.js
- addon/transforms/file.js
- addon/transforms/flexberry-enum.js
- addon/transforms/guid.js
- addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
- app/transforms/decimal.js
- app/transforms/file.js
- app/transforms/flexberry-enum.js
- app/transforms/guid.js
- app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
