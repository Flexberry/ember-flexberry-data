# Модуль: agent-model

## Файлы
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
- app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-model

## Рекомендации по переносу

### Model → TypeScript Class extends OfflineModel

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/agentModel.ts`

**Пример шаблона:**
```ts
// models/agentModel.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class AgentModel extends OfflineModel {
  @attr('string') name?: string;
  @attr('string') description?: string;
  @attr('string') code?: string;
  @attr('string') type?: string;
  @attr('boolean') isActive?: boolean;

  // String representation
  toString(): string {
    return this.name ?? `[Agent: ${this.code}]`;
  }
}
```

## Порядок действий при переносе

1. Перенести `offline-model`
2. Создать `AgentModel` класс
3. Добавить атрибуты

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `offline-model` перенесён
- [ ] `AgentModel` класс создан
- [ ] Атрибуты добавлены
- [ ] Тесты переписаны

## Примечания

- Ember model → TypeScript class
