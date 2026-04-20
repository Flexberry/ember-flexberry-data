# Инструкция по миграции: addon/transforms/flexberry-enum.js

## 📋 Тип Ember-модуля
- **Ember тип:** transform
- **Next.js тип:** transform function

## 📁 Исходный файл (Ember)
```
// addon/transforms/flexberry-enum.js
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

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-flexberry-enum.ts` — transform function

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-flexberry-enum.ts
export function transformFlexberryEnum<T = any>(value: unknown, toBackend: boolean = false): T | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value as T;
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/transforms/transform-flexberry-enum.ts` создан
- [ ] Функция `transformFlexberryEnum` обрабатывает enum values
