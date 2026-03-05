# Модуль: local-store-initializer

## Файлы
- addon/initializers/local-store.js
- app/initializers/local-store.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service (обязательно)

## Рекомендации по переносу

### Initializers → Next.js Setup Function

**Ember:** `app/initializers/local-store.js` → **Next.js:** `src/lib/initializers/localStore.ts`

**Пример шаблона:**
```ts
// lib/initializers/localStore.ts
import { DexieService } from '../services/dexie';
import { OfflineGlobalsService } from '../services/offlineGlobals';

export async function initLocalStore(app: any) {
  const dexieService = app.lookup('service:dexie');
  const offlineGlobalsService = app.lookup('service:offline-globals');
  
  // Инициализация Dexie
  await dexieService.init();
  
  // Проверка online/offline состояния
  const isOnline = offlineGlobalsService.get('isOnline');
  
  // Настройка IndexedDB таблиц
  await dexieService.setupTables(isOnline);
}

// Использование
export async function setupApp() {
  const app = createEmberLikeApp();
  await initOfflineGlobals(app);
  await initLocalStore(app); // Вызывается после offline-globals
  return app;
}
```

## Порядок действий при переносе

1. Перенести `offline-globals-service` (обязательно!)
2. Перенести `dexie-service` (если ещё не перенесён)
3. Создать `initLocalStore()` функцию
4. Вызвать в цепочке инициализации (после offline-globals)
5. Настроить IndexedDB таблицы

## Оценка трудозатрат

≈ 2–4 часа (low)

## Чек-лист для разработчика

- [ ] `offline-globals-service` перенесён
- [ ] `dexie-service` перенесён
- [ ] `initLocalStore()` функция создана
- [ ] Вызов в正しい порядке (после offline-globals)
- [ ] IndexedDB таблицы настроены
- [ ] Async/await логика сохранена

## Примечания

- Порядок инициализации важен: offline-globals → local-store → dexie
