# Модуль: agent-serializer

## Файлы
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
- app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js

## Зависимости (должны быть перенесены ДО этого модуля)
- odata-serializer
- agent-model

## Рекомендации по переносу

### Serializer → Extended Serializer Class

**Ember:** `DS.Serializer` → **Next.js:** `src/serializers/agentSerializer.ts`

**Пример шаблона:**
```ts
// serializers/agentSerializer.ts
import { ODataSerializer } from './odataSerializer';

export class AgentSerializer extends ODataSerializer {
  // OData-specific serialization
}
```

## Порядок действий при переносе

1. Перенести `odata-serializer`
2. Создать `AgentSerializer` класс

## Оценка трудозатрат

≈ 1-2 часа (low)

## Чек-лист для разработчика

- [ ] `odata-serializer` перенесён
- [ ] `AgentSerializer` класс создан

## Примечания

- Ember serializer → TypeScript class
