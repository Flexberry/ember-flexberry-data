# Миграция: enum (execution-variant, type-of-audit-operation) — дубликаты

## Общая информация
Дубликаты enums в `app/enums/`.

## Файлы
- `app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` ↔ `addon/...`
- `app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` ↔ `addon/...`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/enums/execution-variant.ts (если переопределение не требуется)
// Используется та же функция из addon/enums/... (см. INSTRUCTIONS_addon-enums-*.js.md)

// Если требуется кастомное поведение в app/:
// app/lib/enums/execution-variant-custom.ts
export const ExecutionVariantCustom = {
  None: 0,
  Manual: 1,
  Automatic: 2,
  Custom: 3, // кастомное значение
} as const;
```

### Чек-лист
- [ ] Проверено: `app/enums/...` и `addon/enums/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
