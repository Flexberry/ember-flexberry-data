# Миграция: transform (decimal, guid, file, flexberry-enum) — дубликаты

## Общая информация
Дубликаты transform в `app/transforms/`.

## Файлы
- `app/transforms/decimal.js` ↔ `addon/transforms/decimal.js`
- `app/transforms/guid.js` ↔ `addon/transforms/guid.js`
- `app/transforms/file.js` ↔ `addon/transforms/file.js`
- `app/transforms/flexberry-enum.js` ↔ `addon/transforms/flexberry-enum.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/decimal.ts (если переопределение не требуется)
// Используется та же функция из addon/transforms/decimal.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/decimal-custom.ts
import { transformDecimal } from '@/lib/transforms/decimal';

export function transformDecimalCustom(
  value: unknown,
  toBackend: boolean = false
): string | number | null {
  const base = transformDecimal(value, toBackend);
  // Кастомные правила для app/
  return base;
}
```

### Чек-лист
- [ ] Проверено: `app/transforms/...` и `addon/transforms/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
