# Миграция модуля enums

## Общая информация
Модуль `enums` содержит перечисления для Ember Data. В Next.js 16 они преобразуются в TypeScript const objects или enum types.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Enum | TypeScript const enum / enum / object |

## Связи между файлами
Нет зависимостей между файлами модуля enums. Все перечисления изолированы и работают независимо.

## Порядок миграции внутри модуля
1. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` — перечисление execution variant
2. `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` — перечисление type of audit operation

## Как использовать в Next.js
Для каждого enum создать TypeScript const object или enum в папке `app/lib/enums/`.

Пример использования:
```typescript
import { ExecutionVariant } from '@/lib/enums/execution-variant';

const variant = ExecutionVariant[0];
```

## Типы enum в Ember → Next.js
| Ember Enum Name | Next.js Enum Type |
|----------------|------------------|
| `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant` | `ExecutionVariant` |
| `i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation` | `TypeOfAuditOperation` |

## Файлы модуля
- addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
- app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
- app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
