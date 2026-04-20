# Модуль: set-singletons-instance-initializer

## Файлы
- addon/instance-initializers/set-singletons.js
- app/instance-initializers/set-singletons.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service

## Рекомендации по переносу

### Instance Initializer → App Setup Function

**Ember:** `app/instance-initializers/set-singletons.js` → **Next.js:** `src/lib/initializers/setSingletons.ts`

**Пример шаблона:**
```ts
// lib/initializers/setSingletons.ts
import { OfflineGlobalsService } from '../services/offlineGlobals';

export async function setSingletonsInstance(app: any) {
  const offlineGlobalsService = app.lookup('service:offline-globals');
  
  // Set singletons (global instances)
  app.set('offlineGlobals', offlineGlobalsService);
  // ... другие синглтоны
}

export async function setupApp() {
  const app = createEmberLikeApp();
  await initOfflineGlobals(app);
  await setSingletonsInstance(app); // Вызывается после offline-globals
  return app;
}
```

## Порядок действий при переносе

1. Перенести `offline-globals-service`
2. Создать `setSingletonsInstance()` function
3. Вызвать в цепочке инициализации

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-globals-service` перенесён
- [ ] `setSingletonsInstance()` function создана
- [ ] Вызов в правильном порядке
- [ ] Тесты переписаны

## Примечания

- Instance initializer → setup function
- Регистрация синглтонов
