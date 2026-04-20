# Модуль: indexeddb-adapter-query

## Файлы
- addon/query/indexeddb-adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-adapter
- predicate (SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, TruePredicate, FalsePredicate, GeographyPredicate, GeometryPredicate)
- parameter (ConstParam, AttributeParam)
- filter-operator
- information-utils
- get-serialized-date-value-utils
- queue-utils
- js-adapter-query
- dexie-service (Dexie)

## Рекомендации по переносу

### IndexedDBAdapter → TypeScript IndexedDB Query Adapter

**Ember:** `IndexedDBAdapter extends BaseAdapter` → **Next.js:** `src/query/adapters/indexeddbAdapter.ts`

**Пример шаблона:**
```ts
// query/adapters/indexeddbAdapter.ts
import { BaseAdapter } from './baseAdapter';
import { SimplePredicate, ComplexPredicate, StringPredicate,DetailPredicate, DatePredicate, TruePredicate, FalsePredicate,GeographyPredicate, GeometryPredicate } from '../predicate';
import { ConstParam, AttributeParam } from '../parameter';
import { FilterOperator } from '../filterOperator';
import Information from '../utils/information';
import getSerializedDateValue from '../utils/getSerializedDateValue';
import Dexie from 'dexie';

export class IndexedDBAdapter extends BaseAdapter {
  private _db: Dexie;

  constructor(db: Dexie) {
    super();
    this._db = db;
  }

  async query(store: any, query: any): Promise<any> {
    const table = this._db.table(query.modelName);
    
    // Build query with predicate
    let queryResult = table;
    
    if (query.predicate) {
      const jsAdapter = new JSAdapter();
      const filterFunc = jsAdapter.buildFunc(query);
      // Use Dexie where clause where possible
      queryResult = await this._applyPredicate(table, query.predicate);
    }
    
    // Apply ordering
    if (query.order) {
      queryResult = await this._applyOrder(queryResult, query.order);
    }
    
    // Apply pagination
    if (query.skip) {
      queryResult = queryResult.skip(query.skip);
    }
    if (query.top) {
      queryResult = queryResult.limit(query.top);
    }
    
    // Execute query
    const data = await queryResult.toArray();
    
    // Handle expand relationships
    if (query.expand && Object.keys(query.expand).length > 0) {
      // Join related data level by level
      await this._joinRelatedData(data, query.expand);
    }
    
    // Apply projection
    const result = data.map(item => this._applyProjection(item, query.select));
    
    return { meta: { count: query.count ? await this._getCount(query) : data.length }, data: result };
  }
  
  private async _applyPredicate(table: any, predicate: any): Promise<any> {
    // Implement predicate translation to Dexie queries
    // Handle SimplePredicate, DatePredicate, StringPredicate
    throw new Error('Method not implemented');
  }
  
  private async _applyOrder(queryResult: any, order: any): Promise<any> {
    // Implement ordering
    throw new Error('Method not implemented');
  }
  
  private async _joinRelatedData(data: any[], expand: Record<string, any>): Promise<void> {
    // Implement relationship joining
    throw new Error('Method not implemented');
  }
  
  private _applyProjection(item: any, select: string[]): any {
    // Apply projection to result
    const result: any = {};
    select.forEach(key => {
      result[key] = item[key];
    });
    return result;
  }
  
  private async _getCount(query: any): Promise<number> {
    // Get total count for pagination
    throw new Error('Method not implemented');
  }
}

// Helper: JSAdapter for filtering
class JSAdapter {
  buildFunc(query: any): (data: any[]) => any[] {
    return (data: any[]) => {
      // Filter data using predicate logic
      return data;
    };
  }
}
```

## Порядок действий при переносе

1. Перенести `base-adapter`
2. Создать `IndexedDBAdapter` класс
3. Реализовать `query()` method
4. Реализовать predicate translation to Dexie
5. Реализовать relationship joining (expand)
6. Реализовать ordering и pagination

## Оценка трудозатрат

≈ 8-12 часов (medium)

## Чек-лист для разработчика

- [ ] `base-adapter` перенесён
- [ ] `IndexedDBAdapter` класс создан
- [ ] `query()` method with filtering
- [ ] Predicate translation to Dexie
- [ ] Relationship joining (expand)
- [ ] Ordering и pagination
- [ ] Тесты переписаны

## Примечания

- IndexedDB/Dexie adapter
- Complex query building with relationships
- JSAdapter for predicate filtering
