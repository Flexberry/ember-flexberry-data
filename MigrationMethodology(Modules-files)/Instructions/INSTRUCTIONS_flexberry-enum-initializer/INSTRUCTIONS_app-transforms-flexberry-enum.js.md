# Инструкция по миграции: app/transforms/flexberry-enum.js

## 📋 Тип Ember-модуля
- **Ember тип:** transform (переопределение)
- **Next.js тип:** transform function (переопределение)

## 📁 Исходный файл (Ember)
```
// app/transforms/flexberry-enum.js
// Дубликат addon/transforms/flexberry-enum.js
import Transform from '../transforms/flexberry-enum';

export default Transform.extend({
  // Кастомные настройки для app/
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-flexberry-enum-custom.ts` — кастомная функция

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-flexberry-enum-custom.ts
import { transformFlexberryEnum } from './transform-flexberry-enum';

export function transformFlexberryEnumCustom<T = any>(value: unknown, toBackend: boolean = false): T | null {
  const base = transformFlexberryEnum<T>(value, toBackend);
  // Кастомные настройки для app/
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `transform-flexberry-enum-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
