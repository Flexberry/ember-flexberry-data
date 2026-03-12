# Миграция: сериализаторы (base, odata, offline, special) — дубликаты

## Общая информация
Дубликаты сериализаторов в `app/serializers/`.

## Файлы
- `app/serializers/base.js` ↔ `addon/serializers/base.js`
- `app/serializers/odata.js` ↔ `addon/serializers/odata.js`
- `app/serializers/offline.js` ↔ `addon/serializers/offline.js`
- `app/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js` ↔ `addon/...`
- И остальные специфичные

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/serializer-base.ts (если переопределение не требуется)
// Используется та же функция из addon/serializers/base.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/serializer-base-custom.ts
import { transformBaseResponse } from '@/lib/transforms/serializer-base';

export function transformBaseResponseCustom<T = any>(data: any): T {
  const base = transformBaseResponse<T>(data);
  // Кастомные правила для app/
  return base;
}
```

### Чек-лист
- [ ] Проверено: `app/serializers/...` и `addon/serializers/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
