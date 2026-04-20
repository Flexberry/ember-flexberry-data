# Модуль: session-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/sessionModel.ts`

**Пример шаблона:**
```ts
// models/sessionModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class SessionModel extends OfflineModel {
  @attr('string') username?: string;
  @attr('string') sessionId?: string;
  @attr('date') startTime?: Date;
  @attr('date') endTime?: Date;
  @attr('boolean') isActive?: boolean;
  @attr('string') ipAddress?: string;
  @attr('string') userAgent?: string;

  // Relationships
  // @belongsTo('agent') agent?: AgentModel;
  // @hasMany('link-group') linkGroups?: LinkGroupModel[];

  // Methods
  async endSession(): Promise<void> {
    this.endTime = new Date();
    this.isActive = false;
    await this.save();
  }

  async extendSession(): Promise<void> {
    this.endTime = new Date(new Date().getTime() + 30 * 60 * 1000); // +30 min
    await this.save();
  }
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `SessionModel` класс
3. Добавить атрибуты и relationships
4. Добавить специфичные методы

## Оценка трудозатрат

≈ 2-3 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `SessionModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Методы добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
- Декораторы `@attr()`
