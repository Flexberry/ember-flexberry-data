# Миграция модуля initializers

## Общая информация
Модуль `initializers` содержит инициализаторы приложения. В Next.js 16 они преобразуются в setup-логику в `app/layout.tsx`.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Initializer | app/layout.tsx / middleware.ts |

## Файлы модуля (6 файлов)
- addon/initializers/offline-globals.js
- addon/initializers/local-store.js
- addon/initializers/flexberry-enum.js
- app/initializers/offline-globals.js
- app/initializers/local-store.js
- app/initializers/flexberry-enum.js

## Маппинг Ember → Next.js
- `app.initializer({...})` → setup function в `app/layout.tsx`
- `app.inject()` → React Context

## Порядок миграции
1. `offline-globals.js` → `setupOfflineGlobals()` в layout.tsx
2. `local-store.js` → `setupLocalStore()` в layout.tsx
3. `flexberry-enum.js` → `setupFlexberryEnum()` в layout.tsx

## Как использовать в Next.js
Для каждого initializer создать setup function.

Пример:
```typescript
export function setupOfflineGlobals() {
  // Инициализация глобальных переменных
}
```

## Примеры кода (все файлы)
Создать `INSTRUCTIONS_addon-initializers-<name>.md` для каждого файла.

## Зависимости
- @tanstack/react-query
- react
- typescript

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Setup functions работают корректно
- [ ] В `app/layout.tsx` вызваны все setup functions
