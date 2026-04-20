# Миграция модуля query-builder

## Общая информация
Модуль `query-builder` содержит query builder и связанные с OData запросами модули. В Next.js 16 они преобразуются в функции построения запросов.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Query Builder | TypeScript functions for query construction |

## Файлы модуля (12 файлов)
- addon/query/base-adapter.js
- addon/query/base-builder.js
- addon/query/builder.js
- addon/query/condition.js
- addon/query/filter-operator.js
- addon/query/indexeddb-adapter.js
- addon/query/js-adapter.js
- addon/query/odata-adapter.js
- addon/query/order-by-clause.js
- addon/query/parameter.js
- addon/query/predicate.js
- addon/query/query-object.js

## Маппинг Ember → Next.js
Этот модуль содержит вспомогательные классы и функции для построения OData запросов. В Next.js 16:
- Все классы → функции
- Методы классов → standalone functions
- Наследование → Composition

## Порядок миграции
1. `base-builder.js`, `builder.js` — основа построения запросов
2. `condition.js`, `predicate.js`, `filter-operator.js` — фильтрация
3. `order-by-clause.js`, `parameter.js` — сортировка и параметры
4. `base-adapter.js`, `indexeddb-adapter.js`, `js-adapter.js`, `odata-adapter.js` — adapters

## Как использовать в Next.js
Для каждого builder создать функцию построения OData query string.

Пример:
```typescript
export function buildODataQuery(params: any): string {
  const paramsArray: string[] = [];
  if (params.$select) paramsArray.push(`$select=${params.$select}`);
  if (params.$filter) paramsArray.push(`$filter=${params.$filter}`);
  return paramsArray.join('&');
}
```

## Формат инструкций
Создать `INSTRUCTIONS_addon-query-<name>.md` для каждого файла.

Маппинг:
- `BaseBuilder.extend({...})` → `export function buildQuery()` function
- `Condition.create()` → `export function createCondition()` function
- `Predicate.create()` → `export function createPredicate()` function

## Примеры кода (все файлы)
См. примеры в отдельных инструкциях `INSTRUCTIONS_addon-query-*.md` для каждого файла.

## Зависимости
- typescript
- react
- zod (валидация)

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Функции построения запросов работают корректно
- [ ] Валидация через zod
