# Миграция: flexberry-enum transform, initializer (дубликат)

## Общая информация
Файлы в `app/` для flexberry-enum дублируют `addon/`. См. `INSTRUCTIONS_addon-transforms-flexberry-enum.js.md` и `INSTRUCTIONS_addon-initializers-flexberry-enum.js.md`.

## Файлы
- `app/transforms/flexberry-enum.js` ↔ `addon/transforms/flexberry-enum.js`
- `app/initializers/flexberry-enum.js` ↔ `addon/initializers/flexberry-enum.js`

## Маппинг Ember → Next.js
- `Transform.extend({...})` → `transformFlexberryEnum()` function
- `app.initializer({...})` → `setupFlexberryEnum()` function

## Паттерн
Если содержимое одинаковое — использовать только `addon/` версию. Если есть кастомизация — создать файлы `*-custom.ts`.

## Чек-лист
- [ ] Проверено: `app/flexberry-enum/...` и `addon/flexberry-enum/...` содержат одинаковый код
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы `*-custom.ts`
