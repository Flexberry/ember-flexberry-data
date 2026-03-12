# Миграция модуля offline-globals-initializer

## Общая информация
Модуль `offline-globals-initializer` содержит инициализатор offline-globals (адаптирован как отдельный модуль). В Next.js 16 он преобразуется в setup-логику в `app/layout.tsx`.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Initializer | app/layout.tsx setup |

## Файлы модуля (4 файла)
- addon/initializers/offline-globals.js
- app/initializers/offline-globals.js
- addon/services/offline-globals.js
- app/services/offline-globals.js

## Маппинг Ember → Next.js
- `app.initializer({...})` → `setupOfflineGlobals()` в layout.tsx
- `Service.extend({...})` → `useOfflineGlobals()` hook

## Порядок миграции
1. Создать `app/lib/setup/offline-globals.ts`
2. Вызвать `setupOfflineGlobals()` в `app/layout.tsx`

## Как использовать в Next.js
```typescript
export function setupOfflineGlobals() {
  // Инициализация глобальных переменных
}
```

## Примеры кода (все файлы)
Создать `INSTRUCTIONS_addon-initializers-offline-globals.js.md` и `INSTRUCTIONS_addon-services-offline-globals.js.md`

## Зависимости
- @tanstack/react-query
- react
- typescript

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Setup function работает корректно
- [ ] В `app/layout.tsx` вызвана `setupOfflineGlobals()`
