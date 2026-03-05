# Модуль: builder

## Файлы
- addon/query/builder.js
- addon/query/base-builder.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-builder
- predicate (SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, IsOfPredicate)
- parameter (ConstParam, AttributeParam)
- order-by-clause
- query-object
- information-utils
- is-embedded-utils
- string-functions-utils

## Рекомендации по переносу

### Builder → TypeScript Query Builder with Fluent API

**Ember:** `Builder extends BaseBuilder` → **Next.js:** `src/query/builder.ts`

**Пример шаблона:**
```ts
// query/builder.ts
import { BaseBuilder } from './baseBuilder';
import { Predicate } from './predicate';
import { OrderByClause } from './orderByClause';
import { QueryObject } from './queryObject';
import { ConstParam, AttributeParam } from './parameter';
import { FilterOperator } from './filterOperator';
import Information from '../utils/information';
import isEmbedded from '../utils/isEmbedded';

export class Builder extends BaseBuilder {
  private _store: any;
  private _modelName: string;
  private _id: string | number | null = null;
  private _projectionName: string | null = null;
  private _predicate: Predicate | null = null;
  private _orderByClause: OrderByClause | null = null;
  private _top: number | null = null;
  private _skip: number | null = null;
  private _isCount: boolean = false;
  private _select: Record<string, boolean> = {};
  private _expand: Record<string, any> = {};
  private _customQueryParams: Record<string, any> = {};
  private _dataType: string | null = null;

  constructor(store: any, modelName: string) {
    super();
    this._store = store;
    this._modelName = modelName;
  }

  byId(id: string | number): this {
    this._id = id;
    return this;
  }

  from(modelName: string): this {
    this._modelName = modelName;
    return this;
  }

  where(...args: any[]): this {
    // Use predicate creation logic
    return this;
  }

  orderBy(property: string): this {
    this._orderByClause = new OrderByClause(property);
    return this;
  }

  top(top: number): this {
    this._top = top;
    return this;
  }

  skip(skip: number): this {
    this._skip = skip;
    return this;
  }

  count(): this {
    this._isCount = true;
    return this;
  }

  select(attributes: string): this {
    attributes.split(',').forEach(i => this._select[i.trim()] = true);
    return this;
  }

  build(): QueryObject {
    // Implementation similar to Ember version
    // Build query tree, select, expand
    return new QueryObject(
      this._modelName,
      this._id,
      this._projectionName,
      this._predicate,
      this._orderByClause,
      this._top,
      this._skip,
      this._isCount,
      this._expand,
      Object.keys(this._select),
      'id', // primary key name
      {}, // extend tree
      this._customQueryParams,
      this._dataType
    );
  }
}

// Usage example:
// const builder = new Builder(store, 'user').where('name', FilterOperator.Eq, 'John').build();
```

## Порядок действий при переносе

1. Перенести `base-builder`
2. Создать `Builder` класс
3. Реализовать fluent API methods
4. Реализовать `build()` with query tree
5. Обработать select, expand, predicate, order

## Оценка трудозатрат

≈ 6-8 часов (medium)

## Чек-лист для разработчика

- [ ] `base-builder` перенесён
- [ ] `Builder` класс создан
- [ ] Fluent API methods (byId, from, where, orderBy, top, skip, count, select)
- [ ] `build()` method with query tree
- [ ] Тесты переписаны

## Примечания

- Ember query builder → TypeScript query builder
- Fluent API for chaining
- Query tree for select/expand
