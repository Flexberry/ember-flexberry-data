# Модуль: audit-object-type-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/objectTypeModel.ts`

**Пример шаблона:**
```ts
// models/objectTypeModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class ObjectTypeModel extends OfflineModel {
  @attr('string') name?: string;
  @attr('string') description?: string;

  // String representation
  toString(): string {
    return this.name ?? `[ObjectType: ${this.id}]`;
  }
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `ObjectTypeModel` класс
3. Добавить атрибуты

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `ObjectTypeModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
- Object type для audit entities
