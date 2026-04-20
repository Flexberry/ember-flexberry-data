# Миграция модуля services

## Общая информация
Модуль `services` содержит Ember сервисы. В Next.js 16 они преобразуются в React Context + custom hooks.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Service | React Context + custom hook |

## Связи между файлами
- `user.js` — сервис пользователя
- `syncer.js` — сервис синхронизации
- `dexie.js` — сервис IndexedDB (Dexie)
- `offline-globals.js` — глобальные настройки оффлайн

## Порядок миграции внутри модуля
1. `user.js` — сервис пользователя
2. `syncer.js` — сервис синхронизации
3. `dexie.js` — сервис IndexedDB (Dexie)
4. `offline-globals.js` — глобальные настройки оффлайн

## Как использовать в Next.js
Для каждого сервиса создать:
- `app/lib/contexts/<service>.tsx` — React Context
- `app/lib/hooks/use<Service>.ts` — custom hook

Пример:
```typescript
export function useUser() { ... }
```

## Файлы модуля
- addon/services/user.js
- addon/services/syncer.js
- addon/services/dexie.js
- addon/services/offline-globals.js
- app/services/user.js
- app/services/syncer.js
- app/services/dexie.js
- app/services/offline-globals.js
