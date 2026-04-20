# Инструкция по миграции: app/initializers/flexberry-enum.js

## 📋 Тип Ember-модуля
- **Ember тип:** initializer (переопределение)
- **Next.js тип:** setup code (переопределение)

## 📁 Исходный файл (Ember)
```
// app/initializers/flexberry-enum.js
// Дубликат addon/initializers/flexberry-enum.js
import FlexberryEnumInitializer from '../initializers/flexberry-enum';

export default {
  name: 'flexberry-enum',
  initialize: FlexberryEnumInitializer.initialize
};
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/setup/flexberry-enum-custom.ts` — кастомный setup

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/setup/flexberry-enum-custom.ts
import { initFlexberryEnum } from './flexberry-enum';

export function initFlexberryEnumCustom() {
  initFlexberryEnum();
  // Кастомные настройки для app/
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `flexberry-enum-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
