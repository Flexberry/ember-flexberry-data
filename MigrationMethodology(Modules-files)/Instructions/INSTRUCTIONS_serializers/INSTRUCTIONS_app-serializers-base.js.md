# Инструкция по миграции: app/serializers/base.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (переопределение)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// app/serializers/base.js
// Дубликат addon/serializers/base.js с переопределением
import BaseSerializer from '../serializers/base';

export default BaseSerializer.extend({
  // Кастомные настройки для app/
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-base-custom.ts` — кастомная функция

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-base-custom.ts
import { transformOdataResponse } from './transform-odata';

export function transformBaseCustom<T = any>(data: any): T {
  const base = transformOdataResponse<T>(data);
  // Кастомные правила для app/
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Проверено: `app/serializers/base.js` и `addon/serializers/base.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `transform-base-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
