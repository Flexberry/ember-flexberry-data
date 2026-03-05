# Модуль: odata-adapter

## Файлы
- addon/adapters/odata.js
- app/adapters/odata.js

## Зависимости (должны быть перенесены ДО этого модуля)
- snapshot-transform-utils
- odata-adapter-query
- string-functions-utils
- is-uuid-utils
- generate-unique-id-utils
- batch-queries-utils
- builder
- base-adapter
- offline-adapter

## Рекомендации по переносу

### Adapter → API Client Class with OData Support

**Ember:** `DS.Adapter` → **Next.js:** `src/adapters/odataAdapter.ts`

**Пример шаблона:**
```ts
// adapters/odataAdapter.ts
import { OfflineAdapter } from './offlineAdapter';
import { Builder } from '../query/builder';

export class ODataAdapter extends OfflineAdapter {
  constructor(dexieService: any, modelName: string) {
    super(dexieService, modelName);
  }

  // OData-specific query building
  buildQuery(modelName: string, query: any): string {
    // ... construct OData query URL
  }

  // Batch update support
  async batchUpdate(records: any[]): Promise<any[]> {
    // ... batch request logic
  }

  // Handle OData-specific response format
  async handleResponse(response: any): Promise<any> {
    // ... OData response parsing
  }

  // Support for batch queries
  async queryBatch(store: any, type: any, query: any): Promise<any[]> {
    // ... batch query execution
  }
}
```

## Порядок действий при переносе

1. Перенести зависимости (все 9 модулей)
2. Создать `ODataAdapter` класс
3. Реализовать OData query building
4. Реализовать batch update support
5. Обработать OData response format

## Оценка трудозатрат

≈ 16–24 часов (high)

## Чек-лист для разработчика

- [ ] all 9 dependencies перенесены
- [ ] `ODataAdapter` класс создан
- [ ] OData query building
- [ ] batch update support
- [ ] OData response parsing
- [ ] Тесты переписаны

## Примечания

- OData v2/v4 support
- Batch queries через `multipart/mixed`
- Использовать `batch-queries-utils` для парсинга
