# Миграция: app/transforms/file.js

## Тип Ember → Next.js
- Ember тип: transform (переопределение)
- Next.js аналог: функция преобразования (transform function)

### 1. Исходный файл (Ember)
```
// app/transforms/file.js
// Обычно дублирует addon/transforms/file.js с переопределением
import Transform from 'ember-data/transform';

export default Transform.extend({
  serialize(file) {
    if (!file) return null;
    return {
      name: file.get('name'),
      url: file.get('url'),
      size: file.get('size'),
      type: file.get('type'),
    };
  },

  deserialize(data) {
    if (!data) return null;
    return {
      name: data.name,
      url: data.url,
      size: data.size,
      type: data.type,
    };
  }
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/transforms/file-custom.ts` — кастомная функция трансформации (если требуется переопределение)

### 3. Маппинг Ember → Next.js
- `Transform.extend({ serialize, deserialize })` → `export function transformFile(value, toBackend)`
- Если `app/` переопределяет `addon/` — используется `app/` версия

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- axios (для transformRequest/transformResponse)

### 5. Алгоритм миграции
1. Сравнить `app/transforms/file.js` и `addon/transforms/file.js`
2. Если содержимое одинаковое — использовать только `addon/` инструкцию (в `app/` дублирование после build)
3. Если есть отличия — создать кастомную функцию в `app/lib/transforms/file-custom.ts`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/transforms/file.ts (если переопределение не требуется)
// Используется та же функция из addon/transforms/file.js

// Если требуется кастомное поведение в app/:
// app/lib/transforms/file-custom.ts
import { File } from '@/lib/types/file';

export function transformFileCustom(
  value: unknown,
  toBackend: boolean = false
): File | null {
  // Реализация зависит от требований к кастомизации
  return transformFile(value, toBackend); // пример без кастомизации
}
```

### 7. Чек-лист валидации
- [ ] Проверено: `app/transforms/file.js` и `addon/transforms/file.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `file-custom.ts`
