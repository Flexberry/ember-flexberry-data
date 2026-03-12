# Инструкция: odata-query (отдельно)

## Общее описание

Система построения запросов OData. Позволяет создавать фильтры, сортировки, пагинацию и подзапросы в стиле OData v4.

## Состав модуля

- `addon/query/base-adapter.js`
- `addon/query/builder.js`
- `addon/query/indexeddb-adapter.js`
- `addon/query/js-adapter.js`
- `addon/query/odata-adapter.js`
- `addon/query/condition.js`
- `addon/query/filter-operator.js`
- `addon/query/order-by-clause.js`
- `addon/query/parameter.js`
- `addon/query/predicate.js`
- `addon/query/query-object.js`
- `addon/utils/string-functions.js`

## Порядок миграции

1. `builder.js` → `ODataQueryBuilder`
2. `condition.js`, `predicate.js`, `filter-operator.js` → helpers
3. `base-adapter.js`, `indexeddb-adapter.js`, `js-adapter.js`, `odata-adapter.js` → adapter pattern
4. `query-object.js` → `ODataQueryObject`

## Пример кода

- `ODataQueryBuilder` уже есть в `INSTRUCTIONS_odata-query_offline-store.md`
- `ODataQueryObject` — просто обёртка над `new ODataQueryBuilder()`:

```typescript
// app/lib/api/odata-query-object.ts
import { ODataQueryBuilder } from './odata-query';

export class ODataQueryObject {
  private builder: ODataQueryBuilder;

  constructor() {
    this.builder = new ODataQueryBuilder();
  }

  filter(field: string, operator: string, value: any): this {
    this.builder.filter(field, operator as any, value);
    return this;
  }

  orderBy(field: string, order?: 'asc' | 'desc'): this {
    this.builder.orderBy(field, order);
    return this;
  }

  select(...fields: string[]): this {
    this.builder.select(...fields);
    return this;
  }

  expand(...fields: string[]): this {
    this.builder.expand(...fields);
    return this;
  }

  skip(n: number): this {
    this.builder.skip(n);
    return this;
  }

  top(n: number): this {
    this.builder.top(n);
    return this;
  }

  toString(): string {
    return this.builder.toString();
  }

  build(): string {
    return this.builder.build();
  }
}
```

## Итог

- ✅ `ODataQueryBuilder` — основной класс
- ✅ `ODataQueryObject` — обёртка
- ✅ `buildODataQuery()` — статический хелпер

---

## Общий чек-лист миграции

Для модуля `odata-query`:

- [ ] `ODataQueryBuilder` реализован
- [ ] `ODataQueryObject` обёртка
- [ ] `buildODataQuery()` для быстрого вызова
- [ ] Поддержка `$filter`, `$select`, `$expand`, `$orderBy`, `$skip`, `$top`
- [ ] Тесты — `vitest` + `msw`
