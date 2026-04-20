# Модуль: is-uuid-utils

## Файлы
- addon/utils/is-uuid.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (простая утилита)

## Рекомендации по переносу

### Utility → TypeScript Function

**Ember:** ES6 module → **Next.js:** `src/utils/isUUID.ts`

**Пример шаблона:**
```ts
// utils/isUUID.ts
export function isUUID(uuid: string): boolean {
  const uuidStr = String(uuid);
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuidStr);
}

// Alternative using UUID library
// import { v4 as uuidv4 } from 'uuid';
// Usage
if (isUUID(id)) {
  // valid UUID format
}
```

## Порядок действий при переносе

1. Создать `isUUID.ts` файл
2. Переписать функцию `isUUID` с регулярным выражением
3. Можно использовать библиотеку `uuid` для дополнительной валидации

## Оценка трудозатрат

≈ 0.5-1 час (low)

## Чек-лист для разработчика

- [ ] `isUUID` функция создана
- [ ] TypeScript типы добавлены
- [ ] Тесты переписаны

## Примечания

- Проверка UUID по формату (RFC 4122)
- Простая утилита без зависимостей
