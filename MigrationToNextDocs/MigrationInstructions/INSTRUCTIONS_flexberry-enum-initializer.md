# Модуль: flexberry-enum-initializer

## Файлы
- addon/initializers/flexberry-enum.js
- app/initializers/flexberry-enum.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service

## Рекомендации по переносу

### Initializer → Setup Function

**Ember:** `app/initializers/flexberry-enum.js` → **Next.js:** `src/lib/initializers/flexberryEnum.ts`

**Пример шаблона:**
```ts
// lib/initializers/flexberryEnum.ts
import { OfflineGlobalsService } from '../services/offlineGlobals';

export async function initFlexberryEnum(app: any) {
  const offlineGlobalsService = app.lookup('service:offline-globals');
  
  // Register flexberry-enum transform
  // ... registration logic
}

export async function setupApp() {
  const app = createEmberLikeApp();
  await initOfflineGlobals(app);
  await initFlexberryEnum(app); // Вызывается после offline-globals
  return app;
}
```

## Порядок действий при переносе

1. Перенести `offline-globals-service`
2. Создать `initFlexberryEnum()` function
3. Вызвать в цепочке инициализации

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-globals-service` перенесён
- [ ] `initFlexberryEnum()` function создана
- [ ] Вызов в правильном порядке
- [ ] Тесты переписаны

## Примечания

- Простой initializer
- Регистрация transform
