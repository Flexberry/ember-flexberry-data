# Миграция модуля stores

## Общая информация
Модуль `stores` содержит хранилища данных (base-store, local-store, online-store). В Next.js 16 они преобразуются в QueryClient настройки + custom hooks.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Store | QueryClient + hooks |

## Файлы модуля (5 файлов)
- addon/stores/base-store.js
- addon/stores/local-store.js
- addon/stores/online-store.js
- addon/stores/base-store/decorate-adapter.js
- addon/stores/base-store/decorate-api-call.js

## Маппинг Ember → Next.js
- `Store.extend({...})` → `QueryClient` configuration
- `decorateAdapter()` → `queryClient.setQueryDefaults()`
- `decorateApiCall()` → `queryClient.setMutationDefaults()`

## Порядок миграции
1. `base-store.js` — базовая конфигурация
2. `local-store.js` — локальное хранилище
3. `online-store.js` — онлайн хранилище
4. `decorate-adapter.js`, `decorate-api-call.js` — хелперы

## Как использовать в Next.js
Для каждого store создать настройки `QueryClient`.

Пример:
```typescript
export const createBaseStore = () => new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60000 },
  },
});
```

## Примеры кода (все файлы)
Создать `INSTRUCTIONS_addon-stores-<name>.md` для каждого файла.

## Зависимости
- @tanstack/react-query
- react
- typescript

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Настройки `QueryClient` работают корректно
- [ ] Валидация через zod (если нужно)
