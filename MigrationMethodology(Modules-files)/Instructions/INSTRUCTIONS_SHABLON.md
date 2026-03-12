# Шаблонная инструкция для оставшихся файлов
# Используйте Этот шаблон для всех файлов, у которых нет отдельной инструкции

# Миграция: <filename>
## Тип Ember → Next.js
- Ember тип: <type>
- Next.js аналог: <analog>

### 1. Исходный файл (Ember)
```javascript
// <path>
<код>
```

### 2. Целевой файл (Next.js 16)
- `app/lib/<path-to-file>` — <type> implementation

### 3. Маппинг Ember → Next.js
- `<Ember pattern>` → `<Next.js pattern>`

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod (если нужно)
- axios (если нужно)

### 5. Алгоритм миграции
1. Создать папку `app/lib/`
2. Создать файл с соответствующей функцией/hook/interface
3. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// <path-to-file>
/**
 * <description>
 */
export function <name>() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файл `<filename>` создан
- [ ] Функция/hook/interface работает корректно
- [ ] Использование в компонентах

## Примечание
Это шаблонная инструкция. Для конкретных файлов см. аналогичные инструкции в папке `INSTRUCTIONS_<module-name>/`.
