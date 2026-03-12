# Миграция: instance-initializers (set-singletons) — дубликаты

## Общая информация
Дубликаты instance-initializers в `app/instance-initializers/`.

## Файлы
- `app/instance-initializers/set-singletons.js` ↔ `addon/instance-initializers/set-singletons.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/setup/singletons.ts (если переопределение не требуется)
// Используется та же функция из addon/instance-initializers/set-singletons.js

// Если требуется кастомное поведение в app/:
// app/lib/setup/singletons-custom.ts
export function setupSingletonsCustom() {
  // Кастомные настройки для app/
}
```

### Чек-лист
- [ ] Проверено: `app/instance-initializers/set-singletons.js` и `addon/instance-initializers/set-singletons.js` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлен файл `singletons-custom.ts`
