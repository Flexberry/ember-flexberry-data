# План миграции модулей ember-flexberry-data5

## Summary
- Общая трудоёмкость: 75.5 человеко-часа
- Количество шагов: 7

---

## Шаг 1 (~14 ч)
Можно делать ПАРАЛЛЕЛЬНО:
  - transforms (3ч) - тип: transform, зависит от: -
  - enums (1ч) - тип: enum, зависит от: -
  - utils (2ч) - тип: utils, зависит от: create, information
  - regenerated-serializers (8ч) - тип: serializer, зависит от: -

## Шаг 2 (~11 ч)
Можно делать ПАРАЛЛЕЛЬНО (после Шага 1):
  - models (5ч) - тип: model, зависит от: transforms, utils
  - mixins (6ч) - тип: mixin, зависит от: models, utils

## Шаг 3 (~22 ч)
Можно делать ПАРАЛЛЕЛЬНО (после Шага 2):
  - serializers (8ч) - тип: serializer, зависит от: models, mixins, utils
  - query-builder (2ч) - тип: query, зависит от: serializers, utils
  - adapters (12ч) - тип: adapter, зависит от: query-builder, serializers, utils

## Шаг 4 (~6 ч)
Можно делать ПАРАЛЛЕЛЬНО (после Шага 3):
  - stores (6ч) - тип: store, зависит от: adapters, serializers, mixins, query-builder

## Шаг 5 (~13 ч)
Можно делать ПАРАЛЛЕЛЬНО (после Шага 4):
  - services (6ч) - тип: service, зависит от: stores, utils
  - local-store-initializer (3.5ч) - тип: initializer, зависит от: stores
  - initializers (3.5ч) - тип: initializer, зависит от: stores

## Шаг 6 (~7 ч)
Можно делать ПАРАЛЛЕЛЬНО (после Шага 5):
  - flexberry-enum-initializer (3.5ч) - тип: initializer, зависит от: transforms
  - offline-globals-initializer (3.5ч) - тип: initializer, зависит от: services

## Шаг 7 (~2.5 ч)
Можно сделать миграцию:
  - instance-initializers (2.5ч) - тип: instance-initializer, зависит от: services

=== ИТОГО: 7 шагов, 75.5 часов ===
