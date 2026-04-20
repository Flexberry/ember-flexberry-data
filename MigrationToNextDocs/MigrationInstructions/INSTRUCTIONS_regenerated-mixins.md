# Модуль: regenerated-models-mixins, regenerated-serializers-mixins

Это группы regenerated mixin modules из `migration_plan.json`:

```
- regenerated-serializers-mixins (8 mixin files)
- regenerated-models-mixins (8 mixin files)
- session-model-regenerated, agent-model-regenerated, link-group-model-regenerated
- audit-entity-model-regenerated, audit-field-model-regenerated, audit-object-type-model-regenerated
- session-serializer-regenerated, agent-serializer-regenerated, link-group-serializer-regenerated
- audit-entity-serializer-regenerated, audit-field-serializer-regenerated, audit-object-type-serializer-regenerated
```

## Рекомендации по переносу

### Generated Mixins → TypeScript Mixins

**Ember:** `addon/mixins/regenerated/...` → **Next.js:** `src/mixins/regenerated/*.ts`

**Пример шаблона:**
```ts
// mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts
import { SessionSerializer } from '../../../serializers/sessionSerializer';

export function SessionSerializerRegeneratedMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Generated serializer mixin logic
    // Override specific methods if needed
  };
}

// mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.ts
import { SessionModel } from '../../../models/sessionModel';

export function SessionModelRegeneratedMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Generated model mixin logic
    // Override specific methods if needed
  };
}
```

## Порядок действий при переносе

1. Создать `mixins/regenerated/` directory
2. Создать mixin files для каждого regenerated model/serializer
3. Реализовать override methods

## Оценка трудозатрат

≈ 10-15 часов (medium)

## Чек-лист для разработчика

- [ ] `mixins/regenerated/` created
- [ ] 15+ mixin files created
- [ ] Override methods implemented
- [ ] Тесты переписаны

## Примечания

- Generated mixins для custom logic
- TypeScript mixin pattern
- Override methods from base classes
