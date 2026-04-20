# Инструкция по миграции: addon/initializers/flexberry-enum.js

## 📋 Тип Ember-модуля
- **Ember тип:** initializer
- **Next.js тип:** setup code

## 📁 Исходный файл (Ember)
```
// addon/initializers/flexberry-enum.js
export function initialize(appInstance) {
  // Инициализация flexberry-enum
}

export default {
  name: 'flexberry-enum',
  initialize
};
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/setup/flexberry-enum.ts` — setup code

## 📦 Зависимости
- react
- typescript

## 📝 Готовый код

```typescript
// app/lib/setup/flexberry-enum.ts
export function initFlexberryEnum() {
  // Инициализация flexberry-enum
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/setup/flexberry-enum.ts` создан
- [ ] Функция `initFlexberryEnum` вызывается при старте
