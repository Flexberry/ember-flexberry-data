# Миграция: initializer (offline-globals, local-store, flexberry-enum) — дубликаты

## Общая информация
Дубликаты initializers в `app/initializers/`.

## Файлы
- `app/initializers/offline-globals.js` ↔ `addon/initializers/offline-globals.js`
- `app/initializers/local-store.js` ↔ `addon/initializers/local-store.js`
- `app/initializers/flexberry-enum.js` ↔ `addon/initializers/flexberry-enum.js`

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

### Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/setup/offline-globals.ts (если переопределение не требуется)
// Используется та же функция из addon/initializers/offline-globals.js

// Если требуется кастомное поведение в app/:
// app/lib/setup/offline-globals-custom.ts
export function setupOfflineGlobalsCustom() {
  // Кастомные настройки для app/
}
```

### Чек-лист
- [ ] Проверено: `app/initializers/...` и `addon/initializers/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
