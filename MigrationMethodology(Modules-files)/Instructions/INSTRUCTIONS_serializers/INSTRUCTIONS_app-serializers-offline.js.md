# Инструкция по миграции: app/serializers/offline.js

## 📋 Тип Ember-модуля
- **Ember тип:** serializer (переопределение)
- **Next.js тип:** function для преобразования офлайн данных

## 📁 Исходный файл (Ember)
```
// app/serializers/offline.js
// Дубликат addon/serializers/offline.js с пере définition
import OfflineSerializer from '../serializers/offline';

export default OfflineSerializer.extend({
  // Кастомные настройки для app/
});
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/transforms/transform-offline-custom.ts` — кастомная функция

## 📦 Зависимости
- @tanstack/react-query
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/transforms/transform-offline-custom.ts
import { transformOfflineResponse } from './transform-offline';

export function transformOfflineResponseCustom<T = any>(data: any): T {
  const base = transformOfflineResponse<T>(data);
  // Кастомные правила для app/
  return base;
}
```

## ✅ Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только `addon/` версия или добавлен `transform-offline-custom.ts`

**ПРИМЕЧАНИЕ:** Это дубликат файла из addon/ после build
