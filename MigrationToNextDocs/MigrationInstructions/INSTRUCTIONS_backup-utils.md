# Модуль: backup-utils

## Файлы
- addon/utils/backup.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовые утилиты)

## Рекомендации по переносу

### Utils → Pure Function (Higher-Order Function)

**Ember:** `addon/utils/backup.js` → **Next.js:** `src/utils/backup.ts`

**Пример шаблона:**
```ts
// utils/backup.ts
export function backup(
  isModeSwitchOnErrorsEnabled: boolean,
  backupFn: (...args: any[]) => any,
  args: any[]
): (error: any) => any {
  return function(error: any): any {
    if (isModeSwitchOnErrorsEnabled) {
      return backupFn.apply(null, args);
    } else {
      return Promise.reject(error);
    }
  };
}

// Использование:
// const backupFn = backup(true, someFunction, [arg1, arg2]);
// someAsyncOperation().catch(backupFn);
```

## Порядок действий при переносе

1. Создать `backup()` функцию
2. Обработать режим switch на errors

## Оценка трудозатрат

≈ 1–2 часа (low)

## Чек-лист для разработчика

- [ ] `backup()` реализована
- [ ] Higher-order function pattern сохранён
- [ ] Error handling сохранён
- [ ] Тесты переписаны

## Примечания

- Простая higher-order function
- Ember RSVP → native Promise
