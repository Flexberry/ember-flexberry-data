# Модуль: online-store

## Файлы
- addon/stores/online-store.js

## Зависимости (должны быть перенесены ДО этого модуля)
- base-store

## Рекомендации по переносу

### Store → Extended Store Class

**Ember:** `Service.extend({})` → **Next.js:** `src/stores/onlineStore.ts`

**Пример шаблона:**
```ts
// stores/onlineStore.ts
import { BaseStore } from './baseStore';

export class OnlineStore extends BaseStore {
  // Online store specific methods

  // Query from online API
  async queryFromOnline(modelName: string, query: any): Promise<any> {
    // ... query online API
  }

  // Sync methods
  async syncDown(modelName: string, projectionName?: string): Promise<any> {
    // ... sync down from online API
  }

  // Sync up methods
  async syncUp(jobs: any[]): Promise<any> {
    // ... sync up to online API
  }

  // Reload methods
  async reloadRecord(modelName: string, id: string | number, projectionName?: string): Promise<any> {
    // ... reload record from online API
  }

  // Unload methods
  unloadRecord(record: any): void {
    // ... unload record
  }
}
```

## Порядок действий при переносе

1. Перенести `base-store`
2. Создать `OnlineStore` класс
3. Реализовать online-specific methods
4. Sync methods

## Оценка трудозатрат

≈ 8-10 часов (high)

## Чек-лист для разработчика

- [ ] `base-store` перенесён
- [ ] `OnlineStore` класс создан
- [ ] queryFromOnline method
- [ ] sync methods
- [ ] reload methods
- [ ] Тесты переписаны

## Примечания

- Online store for API calls
- Sync with local store
