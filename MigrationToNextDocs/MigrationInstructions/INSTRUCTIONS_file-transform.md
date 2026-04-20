# Модуль: file-transform

## Файлы
- addon/transforms/file.js
- app/transforms/file.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 transform)

## Рекомендации по переносу

### Transform → Class or Functions

**Ember:** `Transform.extend({})` → **Next.js:** `src/transforms/fileTransform.ts`

**Пример шаблона:**
```ts
// transforms/fileTransform.ts
export class FileTransform {
  serialize(value: string | null): string | null {
    // Convert to string for storage (base64 or URL)
    return value ? String(value) : null;
  }

  deserialize(value: string | null): string | null {
    // Parse from storage to file
    return value ? String(value) : null;
  }
}

export function serializeFile(value: any): string | null {
  return value ? String(value) : null;
}

export function deserializeFile(value: any): string | null {
  return value ? String(value) : null;
}
```

## Порядок действий при переносе

1. Создать `FileTransform` class или functions
2. Implement serialize/deserialize

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `FileTransform` создан
- [ ] serialize/deserialize методы
- [ ] Тесты переписаны

## Примечания

- Ember transform → TypeScript class or functions
