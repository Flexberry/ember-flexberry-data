# Миграция: специфичные app/serializers (audit-entity, audit-field, object-type, agent, link-group, session)

## Типы Ember → Next.js
- Ember тип: serializer (переопределение)
- Next.js аналог: функция трансформации (transformResponse function)

### Общая информация
Файлы в `app/serializers/`对于 специфичные модели дублируют `addon/serializers/` с потенциальными переопределениями.

### 1. Исходные файлы (Ember)
```
// app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
// Обычно дублирует addon/... с переопределением
import AuditEntitySerializer from '../serializers/odata';

export default AuditEntitySerializer.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/transforms/serializer-audit-entity-custom.ts`
- `app/lib/transforms/serializer-audit-field-custom.ts`
- `app/lib/transforms/serializer-object-type-custom.ts`
- `app/lib/transforms/serializer-agent-custom.ts`
- `app/lib/transforms/serializer-link-group-custom.ts`
- `app/lib/transforms/serializer-session-custom.ts`

### 3. Маппинг Ember → Next.js
- `Serializer.extend({...})` → `export function transform<Name>ResponseCustom(data)`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios

### 5. Алгоритм миграции
1. Сравнить `app/serializers/...` и `addon/serializers/...`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомные функции в `app/lib/transforms/serializer-*custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-audit-entity.ts (если переопределение не требуется)
// Используется та же функция из addon/serializers/...

// Если требуется кастомное поведение в app/:
// app/lib/transforms/serializer-audit-entity-custom.ts
import { transformAuditEntityResponse } from '@/lib/transforms/serializer-common';

export function transformAuditEntityResponseCustom<T = any>(data: any): T {
  // Кастомные правила для app/
  const base = transformAuditEntityResponse<T>(data);
  // Пример кастомизации
  if (Array.isArray(base)) {
    return base.map(item => {
      // Кастомное преобразование
      return item;
    }) as T;
  }
  return base;
}

// Аналогично для других моделей:
// app/lib/transforms/serializer-audit-field-custom.ts
// app/lib/transforms/serializer-object-type-custom.ts
// app/lib/transforms/serializer-agent-custom.ts
// app/lib/transforms/serializer-link-group-custom.ts
// app/lib/transforms/serializer-session-custom.ts
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/serializers/...` и `addon/serializers/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `serializer-*custom.ts`
