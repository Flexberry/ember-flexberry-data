# План миграции модулей ember-flexberry-data2GenModules

## Summary
- Общая трудоёмкость: 118 человеко-часов
- Количество шагов: 11
- Количество модулей: 13

## Группировка по приоритетам

### High Priority (3 модуля)
1. **core-models** (2 ч)
   - Тип: models
   - Зависимости: -
   - Описание: Базовые модели данных и их расширения
   - Batch: 1

2. **utils** (1 ч)
   - Тип: utils
   - Зависимости: -
   - Описание: Утилитарные функции для работы с моделями
   - Batch: 1

3. **transforms** (2 ч)
   - Тип: transforms
   - Зависимости: utils
   - Описание: Преобразования типов данных Ember Data
   - Batch: 2

4. **odata-query** (2 ч)
   - Тип: query
   - Зависимости: utils
   - Описание: Система построения запросов OData
   - Batch: 2

### Medium Priority (8 модулей)
1. **audit** (5 ч)
   - Тип: models
   - Зависимости: transforms, core-models
   - Описание: Модель аудита и изменения
   - Batch: 3

2. **generated-models** (5 ч)
   - Тип: models
   - Зависимости: core-models, audit
   - Описание: Автогенерированные модели для бизнес-сущностей
   - Batch: 4

3. **regenerated-mixins** (7 ч)
   - Тип: mixins
   - Зависимости: core-models, generated-models
   - Описание: Миксины с автогенерированными атрибутами и проекциями для моделей
   - Batch: 5

4. **offline** (8 ч)
   - Тип: offline
   - Зависимости: core-models, offline-store, utils
   - Описание: Поддержка автономного режима работы (Offline Mode)
   - Batch: 6

5. **offline-store** (6 ч)
   - Тип: stores
   - Зависимости: core-models, offline, utils
   - Описание: Локальное хранилище данных (IndexedDB)
   - Batch: 6

6. **odata** (12 ч)
   - Тип: adapters
   - Зависимости: core-models, offline, odata-query
   - Описание: Адаптер и сериализатор для OData backend
   - Batch: 7

7. **serializers-base** (7 ч)
   - Тип: serializers
   - Зависимости: core-models, offline, odata
   - Описание: Базовый сериализатор и его адаптации
   - Batch: 8

8. **services** (6 ч)
   - Тип: services
   - Зависимости: core-models, offline, offline-store, utils
   - Описание: Ember-сервисы
   - Batch: 9

9. **initializers** (3 ч)
   - Тип: initializers
   - Зависимости: core-models, offline-store, services
   - Описание: Инициализаторы приложения
   - Batch: 10

10. **instance-initializers** (2 ч)
    - Тип: initializers
    - Зависимости: services
    - Описание: Instance-инициализаторы приложения
    - Batch: 11

## Группировка по типам

### models (4 модуля)
- core-models (2 ч)
- audit (5 ч)
- generated-models (5 ч)

### utils (1 модуль)
- utils (1 ч)

### transforms (1 модуль)
- transforms (2 ч)

### query (1 модуль)
- odata-query (2 ч)

### mixins (1 модуль)
- regenerated-mixins (7 ч)

### offline (1 модуль)
- offline (8 ч)

### adapters (1 модуль)
- odata (12 ч)

### serializers (1 модуль)
- serializers-base (7 ч)

### stores (1 модуль)
- offline-store (6 ч)

### services (1 модуль)
- services (6 ч)

### initializers (2 модуля)
- initializers (3 ч)
- instance-initializers (2 ч)

---

## Рекомендации по миграции

1. **Начни с Batch 1**: Сначала мигрируй base modules (core-models и utils)
2. **Batch 2**: После завершения Batch 1 мигрируй transforms и odata-query
3. **Последовательное продолжение**: Каждый последующий batch зависит от предыдущих
4. **Наиболее сложные модули**: odata (12 ч) и offline (8 ч) требуют больше времени
5. **Последними мигрируй**: initializers и instance-initializers, так как они зависят от большинства модулей

=== ИТОГО: 11 шагов, 118 часов ===
