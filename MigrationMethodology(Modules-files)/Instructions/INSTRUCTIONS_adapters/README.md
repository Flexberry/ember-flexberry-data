# Инструкция по миграции: adapters

## 📋 Тип модуля
- **Ember тип:** adapter (DS.Adapter)
- **Next.js тип:** API-слои с `@tanstack/react-query`

## 📂 Связи между файлами
- `odata.js` → OData API (основной)
- `offline.js` → Offline API (резервный)
- `app/adapters/odata.js` и `app/adapters/offline.js` — дубликаты после build

## 🔄 Миграция Ember → Next.js
- Ember adapters → Next.js API layer (axios/fetch)
- `this.ajax()` → `fetch()` или `axios`
- `buildURL()` → URL construction logic

## 🚀 Порядок миграции
1. Создай API-слои в `app/lib/api/odata.ts`
2. Создай хуки для работы с OData (см. `builder`)
3. Интегрируй в `@tanstack/react-query`
4. Замени все `this.store.findRecord()` на `useQuery()`

## ❗ Важные замечания
- `app/adapters/odata.js` и `app/adapters/offline.js` — **это дубликаты файлов из addon/ после build**
- Эти файлы не должны мигрироваться — они генерируются автоматически
- Для Next.js нужен только `addon/adapters/odata.js`
