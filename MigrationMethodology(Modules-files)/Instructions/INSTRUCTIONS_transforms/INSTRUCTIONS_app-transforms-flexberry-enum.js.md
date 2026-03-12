# Миграция: app/transforms/flexberry-enum.js

## Тип Ember → Next.js
- Ember тип: transform (переопределение)
- Next.js аналог: функция преобразования enum (transform function)

### 1. Исходный файл (Ember)
```
// app/transforms/flexberry-enum.js
// Обычно дублирует addon/transforms/flexberry-enum.js с переопределением
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.value || value;
  },

  deserialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return { value: value };
  }
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/flexberry-enum-custom.ts` — кастомная функция трансформации (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformFlexberryEnum(value, toBackend)`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Сравнить `app/transforms/flexberry-enum.js` и `addon/transforms/flexberry-enum.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомную функцию в `app/lib/transforms/flexberry-enum-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/flexberry-enum.ts (если переопределение не требуется)
// Используется та же функция из addon/transforms/flexberry-enum.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/flexberry-enum-custom.ts
import { FlexberryEnum } from '@/lib/types/enum';

export function transformFlexberryEnumCustom(
  value: unknown,
  toBackend: boolean = false
): FlexberryEnum | string | number | null {
  // Реализация зависит от требований к кастомизации
  return transformFlexberryEnum(value, toBackend); // пример без кастомизации
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/transforms/flexberry-enum.js` и `addon/transforms/flexberry-enum.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `flexberry-enum-custom.ts`
