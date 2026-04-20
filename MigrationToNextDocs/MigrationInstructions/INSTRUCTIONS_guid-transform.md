# Модуль: guid-transform

## Файлы
- addon/transforms/guid.js
- app/transforms/guid.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/guidTransform.ts`

**Пример шаблона:**
```ts
// transforms/guidTransform.ts
export class GuidTransform {
  serialize(value: string | null): string | null {
    // Convert to string for storage
    return value ? String(value) : null;
  }

  deserialize(value: string | null): string | null {
    // Parse from storage toGuid
    return value ? String(value) : null;
  }
}

export function serializeGuid(value: any): string | null {
  return value ? String(value) : null;
}

export function deserializeGuid(value: any): string | null {
  return value ? String(value) : null;
}
```

## Порядок действий при переносе

1. Создать `GuidTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `GuidTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
