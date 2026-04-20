# Миграция: app/instance-initializers/set-singletons.js

## Тип Ember → Next.js
- Ember тип: instance-initializer (переопределение)
- Next.js аналог: setup function

### 1. Исходный файл (Ember)
\`\`\`javascript
// app/instance-initializers/set-singletons.js
// Дубликат addon/... с переопределением
export function initialize(appInstance) {
  // Кастомные настройки для app/
}

export default {
  name: 'set-singletons',
  initialize,
};
\`\`\`

### 2. Целевой файл (Next.js 16)
- \`app/lib/setup/singletons-custom.ts\` — кастомная function

### 3. Маппинг Ember → Next.js
- \`app.instanceInitializer(...)\` → \`export function setupSingletonsCustom()\` function

### 4. Зависимости
- @tanstack/react-query, react, typescript

### 5. Алгоритм миграции
1. Создать папку \`app/lib/setup/\`
2. Если есть отличия от addon/ — создать \`singletons-custom.ts\`

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
\`\`\`typescript
// app/lib/setup/singletons-custom.ts
export function setupSingletonsCustom() {
  // Кастомные настройки для app/
}
\`\`\`

### 7. Чек-лист валидации
- [ ] Проверено дублирование
- [ ] Используется только addon/ версия или добавлен \`singletons-custom.ts\`
