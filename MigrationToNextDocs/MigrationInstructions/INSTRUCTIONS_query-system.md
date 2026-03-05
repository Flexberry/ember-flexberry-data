# Модуль: query, query-builder, predicate, parameter, order-by-clause, condition, filter-operator

Это группы query-related modules из `migration_plan.json`:

```
- odata-adapter-query
- base-adapter
- js-adapter-query
- indexeddb-adapter-query
- builder
- base-builder
- query-object
- predicate
- parameter
- order-by-clause
- condition
- filter-operator
```

## Рекомендации по переносу

### Query Builder System → TypeScript Query Builder

**Ember:** `app/query/*.js` → **Next.js:** `src/query/*.ts`

**Пример шаблона:**
```ts
// query/builder.ts
import { BaseBuilder } from './baseBuilder';

export class Builder extends BaseBuilder {
  // Query building methods
  
  select(): Builder {
    // ... select logic
    return this;
  }

  from(modelName: string): Builder {
    // ... from logic
    return this;
  }

  byId(id: string | number): Builder {
    // ... byId logic
    return this;
  }

  where(predicate: Predicate): Builder {
    // ... where logic
    return this;
  }

  orderBy(orderByClause: OrderByClause): Builder {
    // ... orderBy logic
    return this;
  }

  selectByProjection(projectionName: string): Builder {
    // ... selectByProjection logic
    return this;
  }

  build(): any {
    // ... build query object
    return this.queryObject;
  }
}

// query/baseBuilder.ts
export class BaseBuilder {
  protected store: any;
  protected modelName: string;
  protected queryObject: any;

  constructor(store: any, modelName: string) {
    this.store = store;
    this.modelName = modelName;
    this.queryObject = { select: [], from: modelName, where: null, orderBy: null };
  }
}

// query/predicate.ts
export class SimplePredicate {
  filter: string;
  operator: string;
  value: any;
  nextPredicate: SimplePredicate | null = null;
  conjunction: string = 'and';

  constructor(filter: string, operator: string, value: any) {
    this.filter = filter;
    this.operator = operator;
    this.value = value;
  }

  or(predicate: SimplePredicate): SimplePredicate {
    this.nextPredicate = predicate;
    this.conjunction = 'or';
    return this;
  }

  and(predicate: SimplePredicate): SimplePredicate {
    this.nextPredicate = predicate;
    this.conjunction = 'and';
    return this;
  }
}

// query/orderByClause.ts
export class OrderByClause {
  field: string;
  direction: 'ASC' | 'DESC';

  constructor(field: string, direction: 'ASC' | 'DESC' = 'ASC') {
    this.field = field;
    this.direction = direction;
  }
}

// query/condition.ts
export class Condition {
  // Condition logic
}

// query/filterOperator.ts
export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GE = 'ge',
  LT = 'lt',
  LE = 'le',
  CONTAINS = 'contains',
  STARTSWITH = 'startswith',
  ENDSWITH = 'endswith'
}
```

## Порядок действий при переносе

1. Создать `query/` directory
2. Создать `baseBuilder.ts`, `builder.ts`
3. Создать `predicate.ts`, `simplePredicate.ts`
4. Создать `orderByClause.ts`, `condition.ts`, `filterOperator.ts`
5. Реализовать цепочку методов для builder

## Оценка трудозатрат

≈ 10-12 часов (medium)

## Чек-лист для разработчика

- [ ] `baseBuilder.ts` создан
- [ ] `builder.ts` создан с цепочкой методов
- [ ] `predicate.ts` создан
- [ ] `orderByClause.ts` создан
- [ ] `condition.ts` создан
- [ ] `filterOperator.ts` создан
- [ ] Тесты переписаны

## Примечания

- Ember query system → TypeScript query builder
- Fluent API для query building
- Predicate chaining с `and()`, `or()`
