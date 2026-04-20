# Модуль: odata-adapter-query

## Файлы
- addon/query/odata-adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-adapter
- predicate (SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, TruePredicate, FalsePredicate, NotPredicate, IsOfPredicate)
- parameter (ConstParam, AttributeParam)
- filter-operator
- information-utils
- get-serialized-date-value-utils
- string-functions-utils

## Рекомендации по переносу

### ODataAdapter → TypeScript OData URL Builder

**Ember:** `ODataAdapter extends BaseAdapter` → **Next.js:** `src/query/adapters/odataAdapter.ts`

**Пример шаблона:**
```ts
// query/adapters/odataAdapter.ts
import { BaseAdapter } from './baseAdapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, TruePredicate, FalsePredicate, NotPredicate, IsOfPredicate } from '../predicate';
import { ConstParam, AttributeParam } from '../parameter';
import { FilterOperator } from '../filterOperator';
import Information from '../utils/information';
import getSerializedDateValue from '../utils/getSerializedDateValue';
import { capitalize, camelize } from '../utils/stringFunctions';

export class ODataAdapter extends BaseAdapter {
  private _baseUrl: string;
  private _store: any;
  private _info: Information;

  constructor(baseUrl: string, store: any) {
    super();
    if (!baseUrl) throw new Error('Base URL for OData feed is required');
    if (!store) throw new Error('Store is required');
    this._baseUrl = baseUrl;
    this._store = store;
    this._info = new Information(store);
  }

  getODataQuery(query: any): Record<string, string> {
    const builders = {
      $filter: this._buildODataFilters(query),
      $orderby: this._buildODataOrderBy(query),
      $skip: this._buildODataSkip(query),
      $top: this._buildODataTop(query),
      $count: this._buildODataCount(query),
      $select: this._buildODataSelect(query),
      $expand: this._buildODataExpand(query)
    };
    let odataArgs: Record<string, string> = {};
    for (const k in builders) {
      if (builders.hasOwnProperty(k)) {
        const v = builders[k];
        if (v !== null && v !== '') odataArgs[k] = v;
      }
    }
    const customQueryParams = query.customQueryParams || {};
    for (const param in customQueryParams) {
      if (customQueryParams.hasOwnProperty(param)) odataArgs[param] = customQueryParams[param];
    }
    return odataArgs;
  }

  private _buildODataFilters(query: any): string | null {
    if (!query.predicate) return null;
    return this._predicateToODataString(query.predicate);
  }

  private _predicateToODataString(predicate: any): string {
    if (predicate instanceof SimplePredicate) return this._simplePredicateToOData(predicate);
    else if (predicate instanceof ComplexPredicate) return this._complexPredicateToOData(predicate);
    else if (predicate instanceof StringPredicate) return this._stringPredicateToOData(predicate);
    else if (predicate instanceof DatePredicate) return this._datePredicateToOData(predicate);
    else if (predicate instanceof NotPredicate) return `not (${this._predicateToODataString(predicate.predicate)})`;
    else if (predicate instanceof IsOfPredicate) return `isof('${predicate.typeName}')`;
    return '';
  }

  private _simplePredicateToOData(predicate: any): string {
    const attrName = this._getAttributeName(predicate.attributePath);
    const value = this._getValueForOData(predicate.value, predicate.attrType, predicate.timeless);
    const operator = this._mapOperatorToOData(predicate.operator);
    return `${attrName} ${operator} ${value}`;
  }

  private _complexPredicateToOData(predicate: any): string {
    const parts = predicate.predicates.map(p => {
      const str = this._predicateToODataString(p);
      return predicate.predicates.length > 1 ? `(${str})` : str;
    });
    return parts.join(predicate.isAnd ? ' and ' : ' or ');
  }

  private _stringPredicateToOData(predicate: any): string { return ''; }
  private _datePredicateToOData(predicate: any): string { return ''; }

  private _buildODataOrderBy(query: any): string | null {
    if (!query.order || !query.order.length) return null;
    const orderClauses = query.order.map((order: any) => {
      const attrName = order.name;
      const direction = order.direction === 'desc' ? 'desc' : 'asc';
      return `${attrName} ${direction}`;
    });
    return orderClauses.join(',');
  }

  private _buildODataSkip(query: any): string | null {
    if (!query.skip) return null;
    return query.skip.toString();
  }

  private _buildODataTop(query: any): string | null {
    if (!query.top) return null;
    return query.top.toString();
  }

  private _buildODataCount(query: any): string | null {
    if (!query.count) return null;
    return 'true';
  }

  private _buildODataSelect(query: any): string | null {
    if (!query.select || query.select.length === 0) return null;
    return query.select.join(',');
  }

  private _buildODataExpand(query: any): string | null {
    if (!query.expand || Object.keys(query.expand).length === 0) return null;
    const expandClauses = this._buildExpandClauses(query.expand);
    return expandClauses.join(',');
  }

  private _buildExpandClauses(expand: any, parentPath: string = ''): string[] {
    const clauses: string[] = [];
    for (const key in expand) {
      if (expand.hasOwnProperty(key)) {
        const expandInfo = expand[key];
        const path = parentPath ? `${parentPath}/${key}` : key;
        if (expandInfo.select && expandInfo.select.length > 0) {
          clauses.push(`${path}($select=${expandInfo.select.join(',')})`);
        } else {
          clauses.push(path);
        }
        if (expandInfo.expand && Object.keys(expandInfo.expand).length > 0) {
          const childClauses = this._buildExpandClauses(expandInfo.expand, path);
          clauses.push(...childClauses);
        }
      }
    }
    return clauses;
  }

  private _getAttributeName(param: any): string {
    if (param instanceof AttributeParam) return param.attributePath;
    return param;
  }

  private _getValueForOData(param: any, attrType?: string, timeless?: boolean): string {
    if (param instanceof AttributeParam) return param.attributePath;
    else if (param instanceof ConstParam) {
      const value = param.constValue;
      if (attrType === 'date' && value instanceof Date) return `datetime'${value.toISOString()}'`;
      if (typeof value === 'string') return `'${value}'`;
      return value.toString();
    }
    return param.toString();
  }

  private _mapOperatorToOData(operator: string): string {
    const map: Record<string, string> = {
      [FilterOperator.Eq]: 'eq',
      [FilterOperator.Neq]: 'ne',
      [FilterOperator.Geq]: 'ge',
      [FilterOperator.Ge]: 'gt',
      [FilterOperator.Leq]: 'le',
      [FilterOperator.Le]: 'lt'
    };
    return map[operator] || 'eq';
  }
}
```

## Порядок действий при переносе

1. Перенести `base-adapter`
2. Создать `ODataAdapter` класс
3. Реализовать `getODataQuery()` method
4. Реализовать predicate to OData conversion
5. Реализовать orderby, skip, top, select, expand

## Оценка трудозатрат

≈ 8-10 часов (medium)

## Чек-лист для разработчика

- [ ] `base-adapter` перенесён
- [ ] `ODataAdapter` класс создан
- [ ] `getODataQuery()` method
- [ ] Predicate to OData conversion
- [ ] Orderby, skip, top, select, expand
- [ ] Тесты переписаны

## Примечания

- OData URL builder adapter
- Used by ODataAdapter
- Complex query building with nested expand
