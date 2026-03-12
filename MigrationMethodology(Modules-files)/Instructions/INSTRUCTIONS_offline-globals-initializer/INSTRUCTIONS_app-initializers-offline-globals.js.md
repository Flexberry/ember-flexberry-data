# Инструкция по миграции: app/initializers/offline-globals.js

## 📋 Тип Ember-модуля
- **Ember тип:** initializer (переопределение)
- **Next.js тип:** setup code (переопределение)

## 📁 Исходный файл (Ember)
```
// app/initializers/offline-globals.js
// Дубликат addon/initializers/offline-globals.js
import OfflineGlobalsInitializer from '../initializers/offline-globals';

export default {
  name: 'offline-globals',
  initialize: OfflineGlobalsInitializer.initialize
};
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/setup/offline-globals-custom.ts` — кастомный setup

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/setup/offline-globals-custom.ts
import { initOfflineGlobals } from './offline-globals';

export function initOfflineGlobalsCustom() {
  initOfflineGlobals();
  // Кастомные настройки для app/
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `offline-globals-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
