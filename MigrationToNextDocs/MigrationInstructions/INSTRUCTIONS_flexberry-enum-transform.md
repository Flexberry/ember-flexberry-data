# Модуль: flexberry-enum-transform

## Файлы
- addon/transforms/flexberry-enum.js
- app/transforms/flexberry-enum.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/flexberryEnumTransform.ts`

**Пример шаблона:**
```ts
// transforms/flexberryEnumTransform.ts
export class FlexberryEnumTransform {
  serialize(value: any | null): string | number | null {
    // Convert enum to serializable value
    if (value === null || value === undefined) return null;
    return value;
  }

  deserialize(value: string | number | null): any {
    // Parse from storage to enum
    if (value === null || value === undefined) return null;
    return value;
  }
}

export function serializeFlexberryEnum(value: any): string | number | null {
  return value !== null && value !== undefined ? value : null;
}

export function deserializeFlexberryEnum(value: any): any {
  return value !== null && value !== undefined ? value : null;
}
```

## Порядок действий при переносе

1. Создать `FlexberryEnumTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `FlexberryEnumTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
- EnumValues сохраняются как-is
