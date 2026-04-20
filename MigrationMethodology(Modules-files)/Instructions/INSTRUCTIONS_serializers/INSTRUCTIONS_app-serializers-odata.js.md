# Инструкция по миграции: app/serializers/odata.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (переопределение)
- **Next.js тип:** function для преобразования ответов API

## 📁 Исходный файл (Ember)
```
// app/serializers/odata.js
// Дубликат addon/serializers/odata.js с переопределением
import ODataSerializer from '../serializers/odata';

export default ODataSerializer.extend({
  // Кастомные настройки для app/
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-odata-custom.ts` — кастомная функция

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-odata-custom.ts
import { transformOdataResponse } from './transform-odata';

export function transformOdataResponseCustom<T = any>(data: any): T {
  const base = transformOdataResponse<T>(data);
  // Кастомные правила для app/
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `transform-odata-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
