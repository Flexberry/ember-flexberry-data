# Модуль: base-store

## Файлы
- addon/stores/base-store.js
- addon/stores/base-store/decorate-api-call.js
- addon/stores/base-store/decorate-adapter.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service
- user-service
- offline-adapter
- odata-adapter
- offline-serializer
- odata-serializer
- dexie-service

## Рекомендации по переносу

### Store → Extended Store Class

**Ember:** `Service.extend({})` → **Next.js:** `src/stores/baseStore.ts`

**Пример шаблона:**
```ts
// stores/baseStore.ts
import { DexieService } from './dexieService';
import { OfflineGlobalsService } from './offlineGlobalsService';
import { UserService } from './userService';
import { OfflineAdapter } from '../adapters/offlineAdapter';
import { ODataAdapter } from '../adapters/odataAdapter';
import { OfflineSerializer } from '../serializers/offlineSerializer';
import { ODataSerializer } from '../serializers/odataSerializer';

export class BaseStore {
  offlineGlobalsService: OfflineGlobalsService;
  userService: UserService;
  offlineAdapter: OfflineAdapter;
  odataAdapter: ODataAdapter;
  offlineSerializer: OfflineSerializer;
  odataSerializer: ODataSerializer;
  dexieService: DexieService;

  constructor(options: {
    offlineGlobalsService: OfflineGlobalsService;
    userService: UserService;
    dexieService: DexieService;
  }) {
    this.offlineGlobalsService = options.offlineGlobalsService;
    this.userService = options.userService;
    this.dexieService = options.dexieService;
    this.offlineAdapter = new OfflineAdapter(options.dexieService, 'offline');
    this.odataAdapter = new ODataAdapter(options.dexieService, 'odata');
    this.offlineSerializer = new OfflineSerializer();
    this.odataSerializer = new ODataSerializer();
  }

  // Adapter methods
  adapterFor(modelName: string): any {
    return this.offlineAdapter;
  }

  // Serializer methods
  serializerFor(modelName: string): any {
    return this.offlineSerializer;
  }

  // Query methods
  async query(modelName: string, query: any): Promise<any> {
    // ... query logic
  }

  // Find methods
  async findRecord(modelName: string, id: string | number, options?: any): Promise<any> {
    // ... find record logic
  }

  // Create methods
  async createRecord(modelName: string, attributes: any): Promise<any> {
    // ... create record logic
  }

  // Save methods
  async saveRecord(record: any): Promise<any> {
    // ... save record logic
  }

  // Delete methods
  async deleteRecord(record: any): Promise<void> {
    // ... delete record logic
  }
}

// Decorate API call
export function decorateApiCall(fn: Function): Function {
  return function(...args: any[]) {
    // ... decorate logic
    return fn.apply(this, args);
  };
}

// Decorate adapter
export function decorateAdapter(adapter: any): any {
  // ... decorate adapter logic
  return adapter;
}
```

## Порядок действий при переносе

1. Перенести все 7 зависимостей
2. Создать `BaseStore` класс
3. Реализовать adapter/serializer methods
4. Реализовать CRUD operations
5. Создать decorate functions

## Оценка трудозатрат

≈ 12-16 часов (high)

## Чек-лист для разработчика

- [ ] all 7 dependencies перенесены
- [ ] `BaseStore` класс создан
- [ ] Adapter/Serializer methods
- [ ] CRUD operations
- [ ] Decorate functions
- [ ] Тесты переписаны

## Примечания

- Ember Store → TypeScript class
- Композиция адаптеров и сериализаторов
- Decorate functions для API calls
