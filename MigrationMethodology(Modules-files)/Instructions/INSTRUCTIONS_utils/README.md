# Миграция модуля utils

## Общая информация
Модуль `utils` содержит утилиты и вспомогательные функции. В Next.js 16 они преобразуются в TypeScript functions.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Utils | TypeScript functions |

## Файлы модуля (20 файлов)
- addon/utils/attributes.js
- addon/utils/backup.js
- addon/utils/batch-queries.js
- addon/utils/create.js
- addon/utils/enum-functions.js
- addon/utils/first-load-offline-objects.js
- addon/utils/generate-unique-id.js
- addon/utils/get-serialized-date-value.js
- addon/utils/information.js
- addon/utils/is-async.js
- addon/utils/is-embedded.js
- addon/utils/is-model-instance.js
- addon/utils/is-object.js
- addon/utils/is-uuid.js
- addon/utils/model-functions.js
- addon/utils/queue.js
- addon/utils/reload-local-records.js
- addon/utils/snapshot-transform.js
- addon/utils/string-functions.js
- app/utils/batch-queries.js

## Маппинг Ember → Next.js
- `EmberObject.extend({...})` → `export function <name>()` function
- Методы класса → standalone functions

## Порядок миграции
1. `generate-unique-id.js`, `is-uuid.js`, `is-object.js` — проверки
2. `is-async.js`, `is-embedded.js`, `is-model-instance.js` — типы
3. `get-serialized-date-value.js`, `get-serialized-...` — трансформы
4. `backup.js`, `batch-queries.js`, `reload-local-records.js` — операции
5. `snapshot-transform.js`, `attributes.js`, `model-functions.js` — модели
6. `enum-functions.js`, `string-functions.js` — функции

## Как использовать в Next.js
Для каждой утилиты создать standalone function.

Пример:
```typescript
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isUUID(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}
```

## Примеры кода (все файлы)
Создать `INSTRUCTIONS_addon-utils-<name>.md` для каждого файла.

## Зависимости
- typescript
- zod (валидация)

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Функции работают корректно
- [ ] Типы возвращаемых значений
