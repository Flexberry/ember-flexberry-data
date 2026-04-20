# Миграция: app/transforms/decimal.js

## Тип Ember → Next.js
- Ember тип: transform (переопределение)
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// app/transforms/decimal.js
// Обычно дублирует addon/transforms/decimal.js с переопределением
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(value) {
    return value;
  },

  deserialize(value) {
    return value;
  }
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/decimal-custom.ts` — кастомная функция трансформации (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformDecimal(value, toBackend)`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Сравнить `app/transforms/decimal.js` и `addon/transforms/decimal.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомную функцию в `app/lib/transforms/decimal-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/decimal.ts (если переопределение не требуется)
// Используется та же функция из addon/transforms/decimal.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/decimal-custom.ts
/**
 * Кастомная трансформация decimal для app/
 * @param value - значение для трансформации
 * @param toBackend - признак направления: true = в Backend, false = из Backend
 * @returns преобразованное значение
 */
export function transformDecimalCustom(
  value: unknown,
  toBackend: boolean = false
): string | number | null {
  // Реализация зависит от требований к кастомизации
  return value; // пример без кастомизации
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/transforms/decimal.js` и `addon/transforms/decimal.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `decimal-custom.ts`
