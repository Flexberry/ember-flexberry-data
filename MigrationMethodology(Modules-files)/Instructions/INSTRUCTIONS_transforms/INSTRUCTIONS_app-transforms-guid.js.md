# Миграция: app/transforms/guid.js

## Тип Ember → Next.js
- Ember тип: transform (переопределение)
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// app/transforms/guid.js
// Обычно дублирует addon/transforms/guid.js с переопределением
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
- `app/lib/transforms/guid-custom.ts` — кастомная функция трансформации (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformGUID(value, toBackend)`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Сравнить `app/transforms/guid.js` и `addon/transforms/guid.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомную функцию в `app/lib/transforms/guid-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/guid.ts (если переопределение не требуется)
// Используется та же функция из addon/transforms/guid.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/guid-custom.ts
export function transformGuidCustom(
  value: unknown,
  toBackend: boolean = false
): string | null {
  // Реализация зависит от требований к кастомизации
  return transformGUID(value, toBackend); // пример без кастомизации
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/transforms/guid.js` и `addon/transforms/guid.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `guid-custom.ts`
