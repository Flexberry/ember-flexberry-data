# Миграция: model.js (дубликат app/)

## Тип Ember → Next.js
- Ember тип: model (переопределение)
- Next.js аналог: TypeScript interface + hooks

### 1. Исходный файл (Ember)
```
// app/models/model.js
// Обычно дублирует addon/models/model.js с переопределением
import Model from '../models/model';

export default Model.extend({
  // Кастомные настройки для app/
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/types/model-custom.ts` — кастомныйinterface (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Model.extend({...})` → `export interface <Model> extends ... { ... }`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod

### 5. Алгоритм миграции
1. Сравнить `app/models/model.js` и `addon/models/model.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомныйinterface в `app/lib/types/model-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/types/model.ts (если переопределение не требуется)
// Используется та же функция из addon/models/model.js

// Если требуется кастомное поведение в app/:
// app/lib/types/model-custom.ts
import { BaseModel } from '@/lib/types/model';

export interface BaseModelCustom extends BaseModel {
  // Кастомные свойства для app/
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/models/model.js` и `addon/models/model.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `model-custom.ts`
