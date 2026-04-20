# Модуль: audit-field-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/auditFieldModel.ts`

**Пример шаблона:**
```ts
// models/auditFieldModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class AuditFieldModel extends OfflineModel {
  @attr('string') field?: string; // field name
  @attr('any') oldValue?: any;
  @attr('any') newValue?: any;

  // Relationships
  // @belongsTo('audit-entity') auditEntity?: AuditEntityModel;

  // Format field name with type
  get fullFieldName(): string {
    return this.field?.split('@')[0] ?? this.field;
  }

  get fieldType(): string {
    return this.field?.split('@')[1] ?? '';
  }
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `AuditFieldModel` класс
3. Добавить атрибуты и relationships

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `AuditFieldModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
- Audit field для tracking changes
