# Инструкция: transforms

## Общее описание

Модуль содержит преобразование типов данных Ember Data (`Decimal`, `File`, `FlexberryEnum`, `Guid`) в базу данных. В Next.js это — кастомные валидаторы и сериализаторы (TS-типы + функции).

## Состав модуля (файлы)

### Основные файлы
- `addon/transforms/decimal.js`
- `addon/transforms/file.js`
- `addon/transforms/flexberry-enum.js`
- `addon/transforms/guid.js`

### Дубликаты (app/)
- `app/transforms/decimal.js` — дубликат `addon/transforms/decimal.js`
- `app/transforms/file.js` — дубликат `addon/transforms/file.js`
- `app/transforms/flexberry-enum.js` — дубликат `addon/transforms/flexberry-enum.js`
- `app/transforms/guid.js` — дубликат `addon/transforms/guid.js`

### Дополнительные файлы (Audit transforms)
- `app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`
- `app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`
- `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js`
- `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

> 📝 Примечание: Дубликаты `app/` не требуют отдельной миграции. `audit-entities` — расширения `flexberry-enum`.

## Порядок миграции файлов внутри модуля

1. `guid.js` — простая утилита (UUID)
2. `flexberry-enum.js` — enum transformations
3. `decimal.js` — decimal форматирование
4. `file.js` — file handling
5. `audit-specific transforms` — привязка к типам аудита

## Особенности реализации

- Ember `DS.Transform` методы: `serialize(value)` / `deserialize(value)`
- `serialize` — JS → API
- `deserialize` — API → JS
- Для `FlexberryEnum` используется эnum-объект (Ember.Enum)

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `DS.Transform` → Next.js | Создайте функции `transformSerialize`/`transformDeserialize` |
| `enum.getValue('key')` → Next.js | Используйте `enum[key]` или `getEnumValue(enum, key)` |

---

### Файл: `addon/transforms/guid.js`

#### Тип Ember-модуля
Transform (Guid)

#### Тип Next.js-модуля
Plain JS/TS Transform Functions

##### 1. Исходный файл (Ember)
`addon/transforms/guid.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/guid.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `DS.Transform.extend({serialize, deserialize})` | `serializeGuid`, `deserializeGuid` |

##### 4. Зависимости
- `typescript`
- `app/lib/utils/uuid.ts` (генерация UUID)

##### 5. Алгоритм миграции
1. Удалите `DS.Transform.extend`
2. Создайте `serializeGuid(value: string | null): string`
3. Создайте `deserializeGuid(value: string | null): string`
4. Импортируйте `generateUUID()`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/guid.ts
import { generateUUID } from '@/lib/utils/uuid';

/**
 * Сериализует GUID для отправки в API (оставляем как есть, проверяем)
 */
export function serializeGuid(value: string | null): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  return value; // GUID уже в нужном формате
}

/**
 * Десериализует GUID из API
 */
export function deserializeGuid(value: string | null): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  return value;
}

/**
 * Создаёт новый GUID
 */
export function createGuid(): string {
  return generateUUID();
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `DS.Transform`
- [ ] `serializeGuid`, `deserializeGuid`, `createGuid` реализованы
- [ ] Используется `generateUUID` (не Ember)
- [ ] Тесты — `vitest`

---

### Файл: `addon/transforms/flexberry-enum.js`

#### Тип Ember-модуля
Transform (Enum)

#### Тип Next.js-модуля
TS Enum Transform Functions

##### 1. Исходный файл (Ember)
`addon/transforms/flexberry-enum.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/enum.ts` + `app/lib/types/enums.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| Ember.Enum | TypeScript `enum` |
| `this.get('options')` → `enum` | `enum` из imports |
| `serialize(value)` | `serializeEnum(value, enum)` |
| `deserialize(value)` | `deserializeEnum(value, enum)` |

##### 4. Зависимости
- `typescript`
- `app/lib/utils/enum.ts` (getEnumValue, hasEnumValue)

##### 5. Алгоритм миграции
1. Удалите Ember.Enum и `this.get('options')`
2. Создайте `serializeEnum(value, enumType)`
3. Создайте `deserializeEnum(value, enumType)`
4. Добавьте валидацию через `hasEnumValue`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/enum.ts
import { AuditOperationType, ExecutionVariant } from '@/lib/types/enums';
import { hasEnumValue, getEnumValue } from '@/lib/utils/enum';

type EnumType = typeof AuditOperationType | typeof ExecutionVariant;

/**
 * Сериализует enum для API
 */
export function serializeEnum(
  value: string | number | null,
  enumType: EnumType
): string | number | null {
  if (value == null) return null;
  if (hasEnumValue(enumType, value)) return value;
  return null; // невалидное значение
}

/**
 * Десериализует enum из API
 */
export function deserializeEnum(
  value: string | number | null,
  enumType: EnumType
): string | number | null {
  if (value == null) return null;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  return value;
}

/**
 * Получает значение enum по ключу
 */
export function getEnumValueByString(key: string, enumType: EnumType): string | number | undefined {
  return getEnumValue(enumType, key);
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember.Enum
- [ ] Используются TypeScript-enum
- [ ] `serializeEnum`, `deserializeEnum` с валидацией
- [ ] Тесты — `vitest` + инвалидные значения

---

### Файл: `addon/transforms/decimal.js`

#### Тип Ember-модуля
Transform (Decimal)

#### Тип Next.js-модуля
String/Number Transform (locale-aware)

##### 1. Исходный файл (Ember)
`addon/transforms/decimal.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/decimal.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `Ember.get` → `parseInt` | `parseFloat` |
| `Ember.String.fmt` | `toLocaleString` |

##### 4. Зависимости
- `typescript`
- `app/lib/utils/string.ts` (опционально)

##### 5. Алгоритм миграции
1. Удалите `Ember.get`
2. `serialize`: number → string (с сохранением точности)
3. `deserialize`: string → number (parseFloat)

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/decimal.ts

/**
 * Сериализует decimal для API (строка с точной десятичной частью)
 */
export function serializeDecimal(value: number | string | null): string | null {
  if (value == null) return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return null;
  return num.toFixed(10).replace(/\.?0+$/, ''); // remove trailing zeros
}

/**
 * Десериализует decimal из API (строка → number)
 */
export function deserializeDecimal(value: string | number | null): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember-функции
- [ ] `serializeDecimal`, `deserializeDecimal` с `.toFixed`
- [ ] Тесты — `vitest` (например, `serializeDecimal(1.23456789) === '1.23456789'`)

---

### Файл: `addon/transforms/file.js`

#### Тип Ember-модуля
Transform (File/Blob)

#### Тип Next.js-модуля
File/Blob Transform (Base64 или URL)

##### 1. Исходный файл (Ember)
`addon/transforms/file.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/file.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `File` object → Base64 | `FileReader` → `readAsDataURL` |
| API file URL → `File` | `fetch(fileUrl).blob()` |

##### 4. Зависимости
- `typescript`
- `@types/node` (если в Node.js)

##### 5. Алгоритм миграции
1. Удалите Ember-контекст
2. `serializeFile`: File → Base64
3. `deserializeFile`: Base64 → File (async) или URL

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/file.ts

/**
 * Сериализует файл в Base64 (для JSON API)
 */
export async function serializeFile(file: File | null): Promise<string | null> {
  if (file == null || !('type' in file)) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Десериализует Base64 в файл
 */
export async function deserializeFile(base64: string | null, filename?: string): Promise<File | null> {
  if (!base64) return null;

  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  return new File([blob], filename || 'file', { type: mimeString });
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember-функции
- [ ] `serializeFile`, `deserializeFile` работают
- [ ] `FileReader` используется
- [ ] Тесты — `vitest` + мок-файлы

---

### Файл: `addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

#### Тип Ember-модуля
Audit-specific Transform (Enum)

#### Тип Next.js-модуля
AuditEnum Transform (использует `app/lib/transforms/enum.ts`)

##### 1. Исходный файл (Ember)
`addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/transforms/audit-oper.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| Ember Enum → AuditOperationType | Используйте `serializeEnum(..., AuditOperationType)` |

##### 4. Зависимости
- `app/lib/transforms/enum.ts`
- `app/lib/types/enums.ts`

##### 5. Алгоритм миграции
1. Удалите Ember.Enum
2. Используйте `serializeEnum(value, AuditOperationType)`
3. Используйте `deserializeEnum(value, AuditOperationType)`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/audit-oper.ts
import { serializeEnum, deserializeEnum } from '@/lib/transforms/enum';
import { AuditOperationType } from '@/lib/types/enums';

export function serializeAuditOperation(value: string | number | null): string | number | null {
  return serializeEnum(value, AuditOperationType);
}

export function deserializeAuditOperation(value: string | number | null): string | number | null {
  return deserializeEnum(value, AuditOperationType);
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember-функции
- [ ] Используется `serializeEnum`/`deserializeEnum`
- [ ] Тесты — `vitest`

---

## Итог

Модуль `transforms` мигрирован, если:

✅ `serializeGuid`, `deserializeGuid` — GUID прямой (не Ember)  
✅ `serializeEnum`, `deserializeEnum` — TS enum  
✅ `serializeDecimal`, `deserializeDecimal` — `.toFixed`  
✅ `serializeFile`, `deserializeFile` — `FileReader`  
✅ Audit transforms — используют `serializeEnum`  

## Следующий модуль (рекомендуемый порядок)

После `transforms` — перейдите к **`initializers`** и **`instance-initializers`** (они часто простые и можно мигрировать их вместе или с другим модулем).
