# Модуль: decimal-transform

## Файлы
- addon/transforms/decimal.js
- app/transforms/decimal.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/decimalTransform.ts`

**Пример шаблона:**
```ts
// transforms/decimalTransform.ts
export class DecimalTransform {
  serialize(value: number | null): number | null {
    // Convert to number for storage
    return value !== null && value !== undefined ? Number(value) : null;
  }

  deserialize(value: number | null): number | null {
    // Parse from storage to decimal
    return value !== null && value !== undefined ? Number(value) : null;
  }
}

export function serializeDecimal(value: any): number | null {
  return value !== null && value !== undefined ? Number(value) : null;
}

export function deserializeDecimal(value: any): number | null {
  return value !== null && value !== undefined ? Number(value) : null;
}
```

## Порядок действий при переносе

1. Создать `DecimalTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `DecimalTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
