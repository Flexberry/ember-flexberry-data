# Миграция: специфичные модели (audit-entity, audit-field, object-type, agent, link-group, session) — дубликаты

## Общая информация
Дубликаты специфичных моделей в `app/models/`.

## Файлы
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js` ↔ `addon/...`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js` ↔ `addon/...`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js` ↔ `addon/...`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js` ↔ `addon/...`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js` ↔ `addon/...`
- `app/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js` ↔ `addon/...`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/audit-entity.ts (если переопределение не требуется)
// Используется та же функция из addon/models/audit-entity.js

// Если требуется кастомное поведение в app/:
// app/lib/types/audit-entity-custom.ts
import { AuditEntity } from '@/lib/types/audit-entity';

export interface AuditEntityCustom extends AuditEntity {
  // Кастомные свойства для app/
}

// Аналогично для других моделей:
// - audit-field-custom.ts
// - object-type-custom.ts
// - agent-custom.ts
// - link-group-custom.ts
// - session-custom.ts
```

### Чек-лист
- [ ] Проверено: `app/models/...` и `addon/models/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
