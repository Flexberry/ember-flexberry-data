# Инструкция по миграции: addon/initializers/offline-globals.js

## 📋 Тип Ember-модуля
- **Ember тип:** initializer
- **Next.js тип:** setup code

## 📁 Исходный файл (Ember)
```
// addon/initializers/offline-globals.js
export function initialize(appInstance) {
  // Инициализация offline-globals
}

export default {
  name: 'offline-globals',
  initialize
};
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/setup/offline-globals.ts` — setup code

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/setup/offline-globals.ts
export function initOfflineGlobals() {
  // Инициализация offline-globals
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/setup/offline-globals.ts` создан
- [ ] Функция `initOfflineGlobals` вызывается при старте
