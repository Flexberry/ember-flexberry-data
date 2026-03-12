# Инструкция: utils

## Общее описание

Модуль содержит утилитарные функции для работы с моделями данных, валидацией, генерацией ID, преобразованиями и другими операциями. Все функции — чистые JS/TS, не зависят от Ember. Это — основа для остальных модулей.

## Состав модуля (файлы)

### Основные файлы (все из `addon/`, так как это утилиты)
- `addon/utils/attributes.js`
- `addon/utils/backup.js`
- `addon/utils/batch-queries.js`
- `addon/utils/create.js`
- `addon/utils/enum-functions.js`
- `addon/utils/first-load-offline-objects.js`
- `addon/utils/generate-unique-id.js`
- `addon/utils/get-serialized-date-value.js`
- `addon/utils/information.js`
- `addon/utils/is-async.js`
- `addon/utils/is-embedded.js`
- `addon/utils/is-model-instance.js`
- `addon/utils/is-object.js`
- `addon/utils/is-uuid.js`
- `addon/utils/model-functions.js`
- `addon/utils/queue.js`
- `addon/utils/reload-local-records.js`
- `addon/utils/snapshot-transform.js`
- `addon/utils/string-functions.js`
- `app/utils/batch-queries.js` — дубликат `addon/utils/batch-queries.js`

> 📝 Примечание: Дубликат `app/utils/batch-queries.js` — не требует отдельной миграции.

## Порядок миграции файлов внутри модуля

1. `generate-unique-id.js` — простая утилита (без зависимостей)
2. `string-functions.js` — простая утилита (без зависимостей)
3. `is-uuid.js`, `is-object.js`, `is-async.js` — проверяющие функции
4. `enum-functions.js` — работа с эnumами
5. `batch-queries.js` — многоуровневый запрос
6. `queue.js` — очередь задач
7. `create.js`, `model-functions.js`, `attributes.js`, `snapshot-transform.js` — более сложные логики

## Особенности реализации

- Многие функции используют Ember-методы, такие как `ember-get`, `ember-set`, `Ember.isNone`, `Ember.isblank`, `Ember.merge`, `Ember.isEmpty`
- `get`, `set`, `getProperties` — заменяются на обычный JS-доступ
- `Ember.isNone`, `Ember.isEmpty` → `value === null || value === undefined` / `!value`
- `Ember.merge` → `Object.assign` или `lodash.merge` (если нужна глубокая копия)

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| `get(model, 'path.to.attr')` | Замените на `model.path?.to?.attr` или `model['path.to.attr']` |
| `Ember.isNone(value)`, `Ember.isEmpty(value)` | `value === null || value === undefined` / `!value` |
| `Ember.merge(obj1, obj2)` | `Object.assign({}, obj1, obj2)` или `lodash.merge` |
| `Ember.isblank(value)` | `!value || value.trim() === ''` |

---

### Файл: `addon/utils/generate-unique-id.js`

#### Тип Ember-модуля
Util / Helper

#### Тип Next.js-модуля
Plain JS/TS Function (UUID v4)

##### 1. Исходный файл (Ember)
`addon/utils/generate-unique-id.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/utils/uuid.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.uuidv4()` (или кастомная реализация) | `crypto.randomUUID()` (native) |

##### 4. Зависимости
- `typescript`
- `@types/node` (для `crypto` в Node.js)

##### 5. Алгоритм миграции
1. Удалите все `Ember.get`, `Ember.set`
2. Используйте встроенный `crypto.randomUUID()` (Node.js 14.17+)
3. Для браузера без `crypto.randomUUID` — используйте полифил (`uuid`)

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/uuid.ts

/**
 * Генерирует UUID v4 в формате `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Проверяет, является ли строка валидным UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
```

##### 7. Чек-лист качества
- [ ] `crypto.randomUUID()` используется (или `uuid` для совместимости)
- [ ] Добавлена проверка `isValidUUID`
- [ ] Удалены Ember-зависимости (`Ember.get`, `Ember.set`)
- [ ] Тесты: `vitest` + ожидаемое число символов/формат

---

### Файл: `addon/utils/string-functions.js`

#### Тип Ember-модуля
String Utilities

#### Тип Next.js-модуля
Plain JS/TS String Functions

##### 1. Исходный файл (Ember)
`addon/utils/string-functions.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/utils/string.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.isblank(value)` | `(value == null || value.trim() === '')` |
| `Ember.isEmpty(value)` | `value == null || value === ''` |
| `Ember.isNone(value)` | `value === null || value === undefined` |

##### 4. Зависимости
- `typescript`

##### 5. Алгоритм миграции
1. Заменить `Ember.isblank` → `(value == null || value.trim() === '')`
2. Заменить `Ember.isEmpty` → `value == null || value === ''`
3. Удалить все ember-импорты

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/string.ts

/**
 * Проверяет, является ли значение "пустым" (null, undefined, пустая строка)
 */
export function isEmpty(value: unknown): value is '' | null | undefined {
  return value == null || value === '';
}

/**
 * Проверяет, является ли значение "пустым" или "blank" (включая пробелы)
 */
export function isBlank(value: string): boolean {
  return value == null || value.trim() === '';
}

/**
 * Преобразует строку в PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Преобразует строку в camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toLowerCase());
}
```

##### 7. Чек-лист качества
- [ ] `Ember.isEmpty`, `Ember.isblank` заменены на JS-проверки
- [ ] Удалены все `Ember.get`
- [ ] Добавлены unit-тесты (`isEmpty(''), isEmpty(null), isEmpty('a')`)
- [ ] Тесты — `vitest`

---

### Файл: `addon/utils/batch-queries.js`

#### Тип Ember-модуля
Batch Query Utilities

#### Тип Next.js-модуля
Async Batch Fetcher (with parallel requests)

##### 1. Исходный файл (Ember)
`addon/utils/batch-queries.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/utils/batch-queries.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.RSVP.all`, `Ember.getProperties` | `Promise.all`, `Object.assign` |
| Ember Store `peekAll`, `findRecord` | `fetch(...)` + `useQuery` |

##### 4. Зависимости
- `@tanstack/react-query`
- `typescript`

##### 5. Алгоритм миграции
1. Замените `Ember.RSVP.all` → `Promise.all`
2. Замените `Ember.get(model, 'id')` → `model.id`
3. Создайте функцию `fetchBatchRecords(url, ids)`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/batch-queries.ts

interface FetchParams {
  url: string;
  ids: string[];
  batchSize?: number;
}

/**
 * Выполняет пакетную загрузку записей по ID (с разбиением на батчи)
 */
export async function batchFetch({
  url,
  ids,
  batchSize = 100,
}: FetchParams): Promise<unknown[]> {
  const results: unknown[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const query = new URLSearchParams({ filter: `[id] IN (${batchIds.map(() => '?').join(',')})` });

    try {
      const res = await fetch(`${url}?${query.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Batch fetch failed: ${res.status}`);
      const data = await res.json();
      results.push(...(data.data || data));
    } catch (e) {
      console.error('Batch fetch error:', e);
    }
  }
  return results;
}

/**
 * Кастомный хук для React Query
 */
import { useQuery } from '@tanstack/react-query';

export function useBatchRecords(url: string, ids: string[], batchSize = 100) {
  return useQuery({
    queryKey: ['batchRecords', url, ids],
    queryFn: () => batchFetch({ url, ids, batchSize }),
    enabled: ids.length > 0,
    staleTime: 60_000,
  });
}
```

##### 7. Чек-лист качества
- [ ] `Ember.RSVP.all` → `Promise.all`
- [ ] Используется `useQuery` (не `Ember.Data`)
- [ ] Поддерживается `batchSize`
- [ ] Обработка ошибок (`try/catch`, логирование)
- [ ] Тесты — `vitest` + `msw` (mock API)

---

### Файл: `addon/utils/queue.js`

#### Тип Ember-модуля
Task Queue Utility

#### Тип Next.js-модуля
Task Queue (async queue处理器)

##### 1. Исходный файл (Ember)
`addon/utils/queue.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/utils/queue.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.run`, `Ember.run.bind`, `Ember.run.later` | `async/await`, `setTimeout` |
| очередь задач на `Ember.run` | queue microtask + `setImmediate`/`setTimeout` |

##### 4. Зависимости
- `typescript`

##### 5. Алгоритм миграции
1. Замените `Ember.run.bind(this, fn)` → `() => fn()`
2. `Ember.run.later(...)` → `setTimeout(fn, delay)`
3. `Ember.run.schedule('afterRender', ...)` → `queueMicrotask(fn)`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/queue.ts

/**
 * Выполняет функцию в следующей итерации Event Loop
 */
export function nextTick(fn: () => void): void {
  queueMicrotask(fn);
}

/**
 * Выполняет функцию с задержкой
 */
export function delay(fn: () => void, delayMs: number): NodeJS.Timeout {
  return setTimeout(fn, delayMs);
}

/**
 * Очередь задач
 */
export class TaskQueue {
  private tasks: Array<() => void> = [];
  private running = false;

  push(task: () => void): void {
    this.tasks.push(task);
    this.process();
  }

  async process(): Promise<void> {
    if (this.running) return;
    this.running = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        try {
          await task();
        } catch (e) {
          console.error('TaskQueue error:', e);
        }
      }
    }

    this.running = false;
  }
}
```

##### 7. Чек-лист качества
- [ ] `Ember.run` → `queueMicrotask`, `setTimeout`
- [ ] Класс `TaskQueue` реализован
- [ ] Обработка ошибок внутри очереди
- [ ] Тесты — `vitest`

---

### Файл: `addon/utils/enum-functions.js`

#### Тип Ember-модуля
Enum Helpers

#### Тип Next.js-модуля
TypeScript Enums + Helper Functions

##### 1. Исходный файл (Ember)
`addon/utils/enum-functions.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/utils/enum.ts` + `app/lib/types/enums.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| Ember Enum (`Ember.Enum.create`) | TypeScript `enum` / `namespace` / `interface` |
| `enum.get('key')` | `enum.KEY` |
| `enum.getValue('key')` | `enum[enum.KEY]` |

##### 4. Зависимости
- `typescript`

##### 5. Алгоритм миграции
1. Создайте TypeScript `enum` и типы
2. Замените `Ember.Enum` → `enum`
3. Используйте `as const` для литералов
4. Удалите `get`/`set` методы Ember

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/enums.ts
export enum AuditOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
}

export enum ExecutionVariant {
  SYNCHRONOUS = 'SYNCHRONOUS',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  BATCH = 'BATCH',
}

// app/lib/utils/enum.ts

/**
 * Получает значение enum по ключу (включая числовые индексы)
 */
export function getEnumValue<T extends Record<string, string | number>>(
  enumObj: T,
  key: string
): string | number | undefined {
  return enumObj[key as keyof T];
}

/**
 * Получает все ключи enum
 */
export function getEnumKeys<T extends Record<string, string | number>>(enumObj: T): string[] {
  return Object.keys(enumObj);
}

/**
 * Проверяет, содержит ли enum значение
 */
export function hasEnumValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: string | number
): boolean {
  return Object.values(enumObj).includes(value);
}
```

##### 7. Чек-лист качества
- [ ] TypeScript `enum` вместо Ember
- [ ] Утилиты `getEnumValue`, `hasEnumValue`, `getEnumKeys` реализованы
- [ ] Валидация значений через `hasEnumValue`
- [ ] Тесты — `vitest`

---

## Итог

Модуль `utils` мигрирован, если:

✅ `generateUUID()` → `crypto.randomUUID()`  
✅ `isEmpty`, `isBlank`, `toPascalCase`, `toCamelCase` работают  
✅ `batchFetch` с `useBatchRecords` работает  
✅ `TaskQueue` с `nextTick` реализован  
✅ Enum-функции работают с TypeScript-enum  

## Следующий модуль (рекомендуемый порядок)

После `utils` — перейдите к **`transforms`**.
