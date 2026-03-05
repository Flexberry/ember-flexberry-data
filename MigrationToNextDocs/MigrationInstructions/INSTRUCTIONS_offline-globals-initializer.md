# Модуль: offline-globals-initializer

## Файлы
- addon/initializers/offline-globals.js
- app/initializers/offline-globals.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service (обязательно)

## Рекомендации по переносу

### Initializers → Next.js App Router Setup or Module Init

**Ember:** `app/initializers/offline-globals.js` → **Next.js:** `src/lib/initializers/offlineGlobals.ts`

**Пример шаблона:**
```ts
// lib/initializers/offlineGlobals.ts
import { OfflineGlobalsService } from '../services/offlineGlobals';

export async function initOfflineGlobals(app: any) {
  const offlineGlobalsService = app.lookup('service:offline-globals');
  
  // Асинхронная инициализация
  await offlineGlobalsService.init();
  
  // Регистрация в глобальном контексте (если нужно)
  app.register('offlineGlobals', offlineGlobalsService);
}

// Использование в Next.js (например, в app/client.ts или layout.tsx)
export async function setupApp() {
  const app = createEmberLikeApp(); // ваша фабрика приложения
  await initOfflineGlobals(app);
  return app;
}
```

### Ember Initializer Pattern → Next.js Setup Function

Ember инициализаторы работают как `initialize(app)` → Next.js: `setupApp()` функция, вызывается при старте приложения.

```ts
// app/client.ts или app/layout.tsx
import { setupApp } from '@/lib/initializers/offlineGlobals';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await setupApp(); // Вызывается при монтировании layout
  return <html><body>{children}</body></html>;
}
```

## Порядок действий при переносе

1. Перенести `offline-globals-service` (обязательно!)
2. Создать `initOfflineGlobals()` или `setupApp()` функцию
3. Вызвать инициализацию при старте Next.js приложения
4. Убедиться, что сервис зарегистрирован правильно

## Оценка трудозатрат

≈ 2–4 часа (low)

## Чек-лист для разработчика

- [ ] `offline-globals-service` перенесён
- [ ] `initOfflineGlobals()` / `setupApp()` функция создана
- [ ] Инициализация вызывается при старте (layout.tsx или app.ts)
- [ ] Регистрация сервиса в приложении работает
- [ ] Async/await логика сохранена
- [ ] Все Ember-импорты заменены

## Примечания

- Ember инициализаторы → Next.js setup functions
- `app.lookup()` → dependency injection
- Если инициализация асинхронная → использовать async/await в layout
