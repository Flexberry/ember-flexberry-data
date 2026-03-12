# Миграция для дубликатов файлов (app/ модулей)

## Общая информация
Файлы в `app/` дублируют файлы в `addon/` с потенциальными переопределениями.

## Паттерн миграции дубликатов
Для каждого дубликата создать одну инструкцию, в которой:
1. Указать, что это дубликат
2. Привести код из `addon/` (исходный)
3. Привести код для `app/` (если есть кастомизация)
4. Привести общие правила миграции

## Порядок обработки

### 1. Дубликаты в adapters
- `addon/adapters/odata.js` ↔ `app/adapters/odata.js`
- `addon/adapters/offline.js` ↔ `app/adapters/offline.js`

Смотреть: `INSTRUCTIONS_addon-app-adapters-odata.js.md`, `INSTRUCTIONS_addon-app-adapters-offline.js.md`

### 2. Дубликаты в serializers
- `addon/serializers/base.js` ↔ `app/serializers/base.js`
- `addon/serializers/odata.js` ↔ `app/serializers/odata.js`
- `addon/serializers/offline.js` ↔ `app/serializers/offline.js`
- Специфичные сериализаторы (audit-entity и др.)

Смотреть: `INSTRUCTIONS_addon-app-serializers-base-odata-offline.js.md`, `INSTRUCTIONS_addon-app-serializers-special.js.md`

### 3. Дубликаты в models
- `addon/models/model.js` ↔ `app/models/model.js`
- `addon/models/offline-model.js` ↔ `app/models/offline-model.js`
- `addon/models/model-without-validation.js` ↔ `app/models/model-without-validation.js`
- Специфичные модели (audit-entity и др.)

Смотреть: `INSTRUCTIONS_addon-models-model.js.md`, `INSTRUCTIONS_app-models.js.md`

### 4. Дубликаты в transforms
- `addon/transforms/decimal.js` ↔ `app/transforms/decimal.js`
- `addon/transforms/file.js` ↔ `app/transforms/file.js`
- `addon/transforms/flexberry-enum.js` ↔ `app/transforms/flexberry-enum.js`
- `addon/transforms/guid.js` ↔ `app/transforms/guid.js`
- Специфичные transforms

Смотреть: `INSTRUCTIONS_addon-transforms-*.js.md`, `INSTRUCTIONS_app-transforms-*.js.md`

### 5. Дубликаты в services
- `addon/services/user.js` ↔ `app/services/user.js`
- `addon/services/syncer.js` ↔ `app/services/syncer.js`
- `addon/services/dexie.js` ↔ `app/services/dexie.js`
- `addon/services/offline-globals.js` ↔ `app/services/offline-globals.js`

Смотреть: `INSTRUCTIONS_addon-services-user.js.md`, `INSTRUCTIONS_app-services.js.md`

### 6. Дубликаты в initializers
- `addon/initializers/offline-globals.js` ↔ `app/initializers/offline-globals.js`
- `addon/initializers/local-store.js` ↔ `app/initializers/local-store.js`
- `addon/initializers/flexberry-enum.js` ↔ `app/initializers/flexberry-enum.js`

Смотреть: `INSTRUCTIONS_addon-initializers-*.js.md`

### 7. Дубликаты в enums
- `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js` ↔ `app/...`
- `addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js` ↔ `app/...`

Смотреть: `INSTRUCTIONS_addon-enums-*.js.md`

### 8. Дубликаты в instance-initializers
- `addon/instance-initializers/set-singletons.js` ↔ `app/instance-initializers/set-singletons.js`

Смотреть: `INSTRUCTIONS_addon-instance-initializers-set-singletons.js.md`

## Зависимости
- @tanstack/react-query
- react
- typescript
- zod (валидация)
- axios (для adapter/serializer)
- idb (для offline)

## Чек-лист для всех дубликатов
- [ ] Проверено: `app/` и `addon/` содержат одинаковый код (дублирование после build)
- [ ] Используется только `addon/` версия (без дублирования)
- [ ] Если есть кастомизация — добавлены файлы с суффиксом `-custom.ts` или `-custom.tsx`
- [ ] В инструкции описан порядок миграции и примеры кода

## Итого
- Уникальных файлов: ~75
- С учетом дубликатов: 151
- Уже обработано: 57
- Осталось обработать: 94
