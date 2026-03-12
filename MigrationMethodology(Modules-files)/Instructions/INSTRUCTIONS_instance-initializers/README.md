# Миграция модуля instance-initializers

## Общая информация
Модуль `instance-initializers` содержит инициализаторы инстансов для Ember. В Next.js 16 они преобразуются в middleware или setup-логику в `app/layout.tsx`.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Instance-initializer | Middleware (app/middleware.ts) / Layout setup |

## Связи между файлами
- `set-singletons.js` — установка синглтонов (сеттинг сервисов)

## Порядок миграции внутри модуля
1. `addon/instance-initializers/set-singletons.js` — установка синглтонов
2. `app/instance-initializers/set-singletons.js` — переопределение (если есть)

## Как использовать в Next.js
Для instance-initializers использовать:
- `app/middleware.ts` — для middleware-логики
- `app/layout.tsx` — для setup-логики при和нижения компонентов
- `app/lib/setup/singletons.ts` — для установки синглтонов

## Примеры маппинга Ember → Next.js
| Ember Pattern | Next.js Pattern |
|---------------|----------------|
| `app.instanceInitializer({ initialize })` | `export function setupSingletons()` |
| `app.inject()` | Использование React Context |

## Файлы модуля
- addon/instance-initializers/set-singletons.js
- app/instance-initializers/set-singletons.js
