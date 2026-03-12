# Миграция: app/utils/batch-queries.js

## Тип Ember → Next.js
- Ember тип: utils (переопределение)
- Next.js аналог: function

### 1. Исходный файл (Ember)
\`\`\`javascript
// app/utils/batch-queries.js
// Дубликат addon/utils/batch-queries.js с переопределением
import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Кастомные настройки для app/
});
\`\`\`

### 2. Целевой файл (Next.js 16)
- \`app/lib/utils/batch-queries-custom.ts\` — кастомная function

### 3. Маппинг Ember → Next.js
- \`EmberObject.extend(...)\` → \`export function batchQueriesCustom()\` function

### 4. Зависимости
- typescript

### 5. Алгоритм миграции
1. Создать папку \`app/lib/utils/\`
2. Если есть отличия от addon/ — создать \`batch-queries-custom.ts\`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
\`\`\`typescript
// app/lib/utils/batch-queries-custom.ts
import { batchQueries } from '@/lib/utils/batch-queries';

export function batchQueriesCustom() {
  const base = batchQueries();
  // Кастомные правила для app/
  return base;
}
\`\`\`

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен \`batch-queries-custom.ts\`
