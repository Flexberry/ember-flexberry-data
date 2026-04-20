# Миграция: i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js

## Тип Ember → Next.js
- Ember тип: transform
- Next.js аналог: функция преобразования enum (transform function)

### 1. Исходный файл (Ember)
```
// addon/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.value || value;
  },

  deserialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return { value: value };
  }
});
```

```
// app/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
// (обычно дублирует addon/transforms/...)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.ts`

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transform<Name>(value, toBackend)`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Создать папку `app/lib/transforms/`
2. Создать файл с функцией `transformIcsSoftStormNetBusinessAuditObjectsTTypeOfAuditOperation`
3. В `axiosInstance` добавить `transformRequest/transformResponse`
4. Использовать функцию в запросах и ответах для соответствующих полей

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.ts

/**
 * Трансформация TypeOfAuditOperation для Ember Data → Next.js
 * @param value - значение для трансформации
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение
 */
export function transformIcsSoftStormNetBusinessAuditObjectsTTypeOfAuditOperation(
  value: unknown,
  toBackend: boolean = false
): string | number | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Если приходит Ember Enum object {value: 'xxx'}
  if (value && typeof value === 'object' && 'value' in value) {
    if (toBackend) {
      return value.value;
    }
    return value;
  }

  // Если приходит строка/число из Backend
  if (toBackend) {
    return String(value) === 'null' || String(value) === 'undefined' ? null : value;
  }

  return { value: value };
}

// Использование в axios (см. пример в flexberry-enum.js)
```

### 7. Чек-лист валидации
- [ ] Файл создан с функцией `transformIcsSoftStormNetBusinessAuditObjectsTTypeOfAuditOperation`
- [ ] Функция обрабатывает Ember Enum object и primitive value
- [ ] В `axiosInstance` добавлены `transformRequest`/`transformResponse`
- [ ] Проверены имена полей для трансформации
