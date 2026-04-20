# Миграция: offline-model.js, model-without-validation.js (дубликаты)

## Общая информация
Дубликаты моделей в `app/models/`.

## Файлы
- `app/models/offline-model.js` ↔ `addon/models/offline-model.js`
- `app/models/model-without-validation.js` ↔ `addon/models/model-without-validation.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/offline-model.ts (если переопределение не требуется)
// Используется та же функция из addon/models/offline-model.js

// Если требуется кастомное поведение в app/:
// app/lib/types/offline-model-custom.ts
import { OfflineModel } from '@/lib/types/offline-model';

export interface OfflineModelCustom extends OfflineModel {
  // Кастомные свойства для app/
}

// app/lib/types/model-without-validation.ts (если переопределение не требуется)
// Используется та же функция из addon/models/model-without-validation.js

// Если требуется кастомное поведение в app/:
// app/lib/types/model-without-validation-custom.ts
import { ModelWithoutValidation } from '@/lib/types/model-without-validation';

export interface ModelWithoutValidationCustom extends ModelWithoutValidation {
  // Кастомные свойства для app/
}
```

### Чек-лист
- [ ] Проверено: `app/models/...` и `addon/models/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
