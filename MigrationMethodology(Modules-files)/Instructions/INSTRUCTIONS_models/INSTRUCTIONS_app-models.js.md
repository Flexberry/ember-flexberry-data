# Миграция: models (app/ дубликаты)

## Типы Ember → Next.js
- Ember тип: model (переопределение)
- Next.js аналог: TypeScript interface + hooks

### Общая информация
Файлы в `app/models/` дублируют `addon/models/` с потенциальными переопределениями. В Next.js 16 они трансформируются в аналогичные интерфейсы.

### 1. Исходные файлы (Ember)
```
// app/models/model.js
// Обычно дублирует addon/models/model.js с переопределением
import Model from '../models/model';

export default Model.extend({
  // Кастомные настройки для app/
});

// Аналогично для других моделей
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/types/*-custom.ts` — кастомные интерфейсы (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> extends ... { ... }`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod

### 5. Алгоритм миграции
1. Сравнить `app/models/...` и `addon/models/...`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомные интерфейсы в `app/lib/types/*-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts (если переопределение не требуется)
// Используется та же функция из addon/models/...

// Если требуется кастомное поведение в app/:
// app/lib/types/model-custom.ts
import { BaseModel } from '@/lib/types/model';

export interface BaseModelCustom extends BaseModel {
  // Кастомные свойства для app/
}

// Аналогично для других моделей:
// app/lib/types/offline-model-custom.ts
// app/lib/types/model-without-validation-custom.ts
// app/lib/types/audit-entity-custom.ts
// app/lib/types/audit-field-custom.ts
// app/lib/types/object-type-custom.ts
// app/lib/types/agent-custom.ts
// app/lib/types/link-group-custom.ts
// app/lib/types/session-custom.ts
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/models/...` и `addon/models/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
