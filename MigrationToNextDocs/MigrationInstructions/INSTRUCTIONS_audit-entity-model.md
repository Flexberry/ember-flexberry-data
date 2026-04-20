# Модуль: audit-entity-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/auditEntityModel.ts`

**Пример шаблона:**
```ts
// models/auditEntityModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class AuditEntityModel extends OfflineModel {
  @attr('date') operationTime?: Date;
  @attr('string') operationType?: string; // INSERT, UPDATE, DELETE
  @attr('string') executionResult?: string; // Не выполнено, Выполнено, Ошибка
  @attr('string') objectPrimaryKey?: string;
  @attr('date') createTime?: Date;
  @attr('string') creator?: string;
  @attr('date') editTime?: Date;
  @attr('string') editor?: string;

  // Relationships
  @attr('string') objectType?: string;
  @attr('string') user?: string;
  @attr('hasMany') auditFields?: AuditFieldModel[];

  // Methods
  get isExecuted(): boolean {
    return this.executionResult === 'Выполнено';
  }

  get hasError(): boolean {
    return this.executionResult === 'Ошибка';
  }

  get isFailed(): boolean {
    return this.executionResult === 'Не выполнено';
  }
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `AuditEntityModel` класс
3. Добавить атрибуты и relationships
4. Добавить methods

## Оценка трудозатрат

≈ 2-3 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `AuditEntityModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Methods добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
- Аудит entity для sync up
