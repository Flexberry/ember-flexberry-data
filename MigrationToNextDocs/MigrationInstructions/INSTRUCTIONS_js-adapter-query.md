# Модуль: js-adapter-query

## Файлы
- addon/query/js-adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-adapter
- predicate (SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, TruePredicate, FalsePredicate, GeographyPredicate, GeometryPredicate)
- parameter (ConstParam, AttributeParam)
- filter-operator
- condition
- information-utils

## Рекомендации по переносу

### JSAdapter → TypeScript JS Array Filter Adapter

**Ember:** `JSAdapter extends BaseAdapter` → **Next.js:** `src/query/adapters/jsAdapter.ts`

**Пример шаблона:**
```ts
// query/adapters/jsAdapter.ts
import { BaseAdapter } from './baseAdapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, TruePredicate, FalsePredicate, GeographyPredicate, GeometryPredicate } from '../predicate';
import { ConstParam, AttributeParam } from '../parameter';
import { FilterOperator } from '../filterOperator';
import Information from '../utils/information';

export class JSAdapter extends BaseAdapter {
  private _moment: any;

  constructor(moment?: any) {
    super();
    if (moment) this._moment = moment;
  }

  buildFunc(query: any): (data: any[]) => any[] {
    const filter = query.predicate ? this.buildFilter(query.predicate) : (data: any[]) => data;
    const order = this.buildOrder(query);
    const projection = this.buildProjection(query);
    const topSkip = this.buildTopSkip(query);
    return (data: any[]) => projection(topSkip(order(filter(data))));
  }

  buildFilter(predicate: any, options?: any): (data: any[]) => any[] {
    if (!predicate) return (data: any[]) => data;
    return (data: any[]) => data.filter(item => this._evaluatePredicate(item, predicate, options));
  }

  private _evaluatePredicate(item: any, predicate: any, options?: any): boolean {
    if (predicate instanceof SimplePredicate) return this._evaluateSimplePredicate(item, predicate, options);
    else if (predicate instanceof ComplexPredicate) return this._evaluateComplexPredicate(item, predicate, options);
    else if (predicate instanceof StringPredicate) return this._evaluateStringPredicate(item, predicate, options);
    else if (predicate instanceof DatePredicate) return this._evaluateDatePredicate(item, predicate, options);
    else if (predicate instanceof TruePredicate) return true;
    else if (predicate instanceof FalsePredicate) return false;
    return true;
  }

  private _evaluateSimplePredicate(item: any, predicate: any, options?: any): boolean {
    const attrName = this._getAttributeName(predicate.attributePath);
    const value = this._getValue(predicate.value, item, predicate.attrType, options);
    switch (predicate.operator) {
      case FilterOperator.Eq: return item[attrName] === value;
      case FilterOperator.Neq: return item[attrName] !== value;
      case FilterOperator.Geq: return item[attrName] >= value;
      case FilterOperator.Ge: return item[attrName] > value;
      case FilterOperator.Leq: return item[attrName] <= value;
      case FilterOperator.Le: return item[attrName] < value;
      default: return true;
    }
  }

  private _evaluateComplexPredicate(item: any, predicate: any, options?: any): boolean {
    const results = predicate.predicates.map(p => this._evaluatePredicate(item, p, options));
    return predicate.isAnd ? results.every(r => r) : results.some(r => r);
  }

  private _evaluateStringPredicate(item: any, predicate: any, options?: any): boolean { return true; }
  private _evaluateDatePredicate(item: any, predicate: any, options?: any): boolean { return true; }

  buildOrder(query: any): (data: any[]) => any[] {
    if (!query.order || !query.order.length) return (data: any[]) => data;
    return (data: any[]) => {
      return data.sort((a, b) => {
        for (const order of query.order) {
          const attrName = order.name;
          const direction = order.direction || 'asc';
          const aVal = a[attrName];
          const bVal = b[attrName];
          let comparison = 0;
          if (!aVal && bVal) comparison = -1;
          else if (aVal && !bVal) comparison = 1;
          else if (aVal < bVal) comparison = -1;
          else if (aVal > bVal) comparison = 1;
          if (direction === 'desc') comparison = -comparison;
          if (comparison !== 0) return comparison;
        }
        return 0;
      });
    };
  }

  buildTopSkip(query: any): (data: any[]) => any[] {
    if (!query.top && !query.skip) return (data: any[]) => data;
    return (data: any[]) => {
      const result: any[] = [];
      for (let i = 0; i < data.length; i++) {
        if (i < query.skip!) continue;
        result.push(data[i]);
        if (result.length >= query.top!) break;
      }
      return result;
    };
  }

  buildProjection(query: any): (data: any[]) => any[] {
    if (!query.select || query.select.length === 0) return (data: any[]) => data;
    return (data: any[]) => {
      return data.map(item => {
        const result: any = {};
        query.select.forEach(key => { result[key] = item[key]; });
        return result;
      });
    };
  }

  private _getAttributeName(param: any): string {
    if (param instanceof AttributeParam) return param.attributePath;
    return param;
  }

  private _getValue(param: any, item: any, attrType?: string, options?: any): any {
    if (param instanceof AttributeParam) return item[param.attributePath];
    else if (param instanceof ConstParam) return param.constValue;
    return param;
  }
}
```

## Порядок действий при переносе

1. Перенести `base-adapter`
2. Создать `JSAdapter` класс
3. Реализовать `buildFunc()` method
4. Реализовать predicate evaluation methods
5. Реализовать ordering и pagination
6. Реализовать projection

## Оценка трудозатрат

≈ 6-8 часов (medium)

## Чек-лист для разработчика

- [ ] `base-adapter` перенесён
- [ ] `JSAdapter` класс создан
- [ ] `buildFunc()` method
- [ ] Predicate evaluation methods
- [ ] Ordering и pagination
- [ ] Projection
- [ ] Тесты переписаны

## Примечания

- JS array filtering adapter
- Used by both IndexedDBAdapter и other adapters
- Short circuit evaluation for predicates
