# Миграция: offline-globals service, initializer (дубликат)

## Общая информация
Файлы в `app/` для offline-globals дублируют `addon/`. См. `INSTRUCTIONS_addon-services-offline-globals.js.md` и `INSTRUCTIONS_addon-initializers-offline-globals.js.md`.

## Файлы
- `app/services/offline-globals.js` ↔ `addon/services/offline-globals.js`
- `app/initializers/offline-globals.js` ↔ `addon/initializers/offline-globals.js`

## Маппинг Ember → Next.js
- `Service.extend({...})` → `useOfflineGlobals()` hook
- `app.initializer({...})` → `setupOfflineGlobals()` function

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.tsx`.

## Чек-лист
- [ ] Проверено: `app/offline-globals/...` и `addon/offline-globals/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.tsx`
