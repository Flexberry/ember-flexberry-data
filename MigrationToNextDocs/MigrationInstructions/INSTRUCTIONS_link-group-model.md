# Модуль: link-group-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/linkGroupModel.ts`

**Пример шаблона:**
```ts
// models/linkGroupModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class LinkGroupModel extends OfflineModel {
  @attr('string') name?: string;
  @attr('string') code?: string;
  @attr('string') description?: string;
  @attr('boolean') isActive?: boolean;

  // Relationships
  // @hasMany('agent') agents?: AgentModel[];
  // @belongsTo('link-group') parent?: LinkGroupModel;
  // @hasMany('link-group') children?: LinkGroupModel[];
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `LinkGroupModel` класс
3. Добавить атрибуты и relationships

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `LinkGroupModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
