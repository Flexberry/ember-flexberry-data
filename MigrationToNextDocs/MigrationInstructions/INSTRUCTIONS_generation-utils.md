# Модуль: generation-utils

## Файлы
- addon/utils/generate-unique-id.js
- addon/utils/get-serialized-date-value.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовые утилиты)

## Рекомендации по переносу

### Utils → Pure Functions

**Ember:** `addon/utils/generate-unique-id.js` → **Next.js:** `src/utils/generation.ts`

**Пример шаблона:**
```ts
// utils/generation.ts
// Вместо node-uuid использовать нативный Web Crypto API или nanoid
export function generateUniqueId(): string {
  // Using Web Crypto API (native in browsers)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Convert to UUID v4 format
  array[6] = (array[6] & 0x0f) | 0x40; // version
  array[8] = (array[8] & 0x3f) | 0x80; // variant
  
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
}

// Альтернатива - использовать nanoid (если установлен пакет)
// import { nanoid } from 'nanoid';
// export function generateUniqueId(): string {
//   return nanoid();
// }

export function getSerializedDateValue(date: Date | string | null): string | null {
  if (!date) return null;
  return new Date(date).toISOString();
}
```

## Порядок действий при переносе

1. Создать `generation.ts`
2. Реализовать `generateUniqueId()`
3. Реализовать `getSerializedDateValue()`
4. Заменить `node-uuid` на native или `nanoid`

## Оценка трудозатрат

≈ 2–3 часов (low)

## Чек-лист для разработчика

- [ ] `generateUniqueId()` реализована (native или nanoid)
- [ ] `getSerializedDateValue()` реализована
- [ ] UUID v4 формат сохранён
- [ ] Тесты переписаны

## Примечания

- UUID v4 можно генерировать нативно через Web Crypto API
- Альтернатива: `npm install nanoid` и использовать `nanoid()`
