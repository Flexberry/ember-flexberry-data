# Модуль: store-mixin

## Файлы
- addon/mixins/store.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service
- offline-adapter
- odata-adapter
- builder (query builder)

## Рекомендации по переносу

### Store Mixin → Extended Store Class

**Ember:** `Mixin.create({})` → **Next.js:** `src/mixins/storeMixin.ts`

**Пример шаблона:**
```ts
// mixins/storeMixin.ts
import { Builder } from '../query/builder';

export function StoreMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Override query method
    async query(modelName: string, query: any): Promise<any> {
      console.debug(`Flexberry Store::query ${modelName}`, query);
      const results = await super.query(modelName, query);
      
      if (results && Array.isArray(results)) {
        results.forEach(result => result.didLoad());
      }
      
      return results;
    }

    // Override queryRecord
    async queryRecord(modelName: string, query: any): Promise<any> {
      console.debug(`Flexberry Store::queryRecord ${modelName}`, query);
      const result = await this.query(modelName, query);
      return result?.get?.('firstObject') || result?.[0] || null;
    }

    // Override findAll
    async findAll(modelName: string, options?: any): Promise<any> {
      console.debug(`Flexberry Store::findAll ${modelName}`);
      
      const builder = new Builder(this, modelName);
      
      if (options?.projection) {
        console.debug(`Flexberry Store::findAll using projection '${options.projection}'`);
        builder.selectByProjection(options.projection);
        return this.query(modelName, builder.build());
      }
      
      const queryObject = builder.build();
      queryObject.select = [];
      return this.query(modelName, queryObject);
    }

    // Override findRecord
    async findRecord(modelName: string, id: string | number, options?: any): Promise<any> {
      console.debug(`Flexberry Store::findRecord ${modelName}(${id})`);
      
      const builder = new Builder(this, modelName).byId(id);
      
      if (options?.projection) {
        console.debug(`Flexberry Store::findRecord using projection '${options.projection}'`);
        builder.selectByProjection(options.projection);
        const result = await this.query(modelName, builder.build());
        return result?.get?.('firstObject') || result?.[0] || null;
      }
      
      const queryObject = builder.build();
      queryObject.select = [];
      const result = await this.query(modelName, queryObject);
      return result?.get?.('firstObject') || result?.[0] || null;
    }
  };
}

// Использование:
// class BaseStore extends StoreMixin(EmberDataStore) {
//   // ...
// }
```

## Порядок действий при переносе

1. Перенести зависимости (offline-globals, offline-adapter, odata-adapter, builder)
2. Создать `StoreMixin` функцию
3. Переопределить методы: `query()`, `queryRecord()`, `findAll()`, `findRecord()`
4. Интеграция с Builder для projection support

## Оценка трудозатрат

≈ 8-10 часов (high)

## Чек-лист для разработчика

- [ ] all dependencies перенесены
- [ ] `StoreMixin` реализован
- [ ] `query()`, `queryRecord()` переопределены
- [ ] `findAll()`, `findRecord()` с projection support
- [ ] Builder integration
- [ ] Тесты переписаны

## Примечания

- Mixin для Store
- Projection support через Builder
- Ember `debug()` → `console.debug()`
