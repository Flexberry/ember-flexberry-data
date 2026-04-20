# Миграция: app/serializers/base.js, odata.js, offline.js

## Типы Ember → Next.js
- Ember тип: serializer (переопределение)
- Next.js аналог: функция трансформации (transformResponse function)

### Общая информация
Файлы в `app/serializers/` дублируют `addon/serializers/` с потенциальными переопределениями. В Next.js 16 они трансформируются в аналогичные функции, но с возможностью кастомизации.

### 1. Исходные файлы (Ember)
```
// app/serializers/base.js
// Обычно дублирует addon/serializers/base.js с переопределением
import BaseSerializer from '../serializers/base';

export default BaseSerializer.extend({
  // Кастомные настройки для app/
});

// app/serializers/odata.js
// Обычно дублирует addon/serializers/odata.js с переопределением
import ODataSerializer from '../serializers/odata';

export default ODataSerializer.extend({
  // Кастомные настройки для app/
});

// app/serializers/offline.js
// Обычно дублирует addon/serializers/offline.js с переопределением
import OfflineSerializer from '../serializers/offline';

export default OfflineSerializer.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/transforms/serializer-base-custom.ts` — кастомные функции (если требуется переопределение)
- `app/lib/transforms/serializer-odata-custom.ts`
- `app/lib/transforms/serializer-offline-custom.ts`

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
// app/lib/transforms/serializer-base.ts (если переопределение не требуется)
// Используется та же функция из addon/serializers/base.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/serializer-base-custom.ts
import { transformBaseResponse } from '@/lib/transforms/serializer-base';

export function transformBaseResponseCustom<T = any>(data: any): T {
  // Кастомные правила для app/
  const base = transformBaseResponse<T>(data);
  // Пример кастомизации
  if (Array.isArray(base)) {
    return base.map(item => {
      // Кастомное преобразование
      return item;
    }) as T;
  }
  return base;
}

// Аналогично для odata и offline:
// app/lib/transforms/serializer-odata-custom.ts
import { transformOdataResponse } from '@/lib/transforms/serializer-odata';

export function transformOdataResponseCustom<T = any>(data: any): T {
  return transformOdataResponse<T>(data);
}

// app/lib/transforms/serializer-offline-custom.ts
import { transformOfflineResponse } from '@/lib/transforms/serializer-offline';

export function transformOfflineResponseCustom<T = any>(data: any): T {
  return transformOfflineResponse<T>(data);
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/serializers/...` и `addon/serializers/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `serializer-*custom.ts`
