# Миграция модуля flexberry-enum-initializer

## Общая информация
Модуль `flexberry-enum-initializer` содержит инициализатор flexberry-enum. В Next.js 16 он преобразуется в setup-логику в `app/layout.tsx`.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Initializer | app/layout.tsx setup |
| Transform | app/lib/transforms/flexberry-enum.ts |

## Файлы модуля (4 файла)
- addon/initializers/flexberry-enum.js
- app/initializers/flexberry-enum.js
- addon/transforms/flexberry-enum.js
- app/transforms/flexberry-enum.js

## Маппинг Ember → Next.js
- `app.initializer({...})` → `setupFlexberryEnum()` в layout.tsx
- `Transform.extend({...})` → `transformFlexberryEnum()` function

## Порядок миграции
1. Создать `app/lib/setup/flexberry-enum.ts`
2. Вызвать `setupFlexberryEnum()` в `app/layout.tsx`
3. Создать `app/lib/transforms/flexberry-enum.ts` с функцией трансформации

## Как использовать в Next.js
```typescript
export function setupFlexberryEnum() {
  // Инициализация flexberry-enum
}
```

## Примеры кода
Создать `INSTRUCTIONS_addon-initializers-flexberry-enum.js.md` и `INSTRUCTIONS_addon-transforms-flexberry-enum.js.md`

## Зависимости
- @tanstack/react-query
- react
- typescript

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Setup function и transform function работают корректно
- [ ] В `app/layout.tsx` вызвана `setupFlexberryEnum()`
