# План миграции модулей ember-flexberry-data2GenModules

## Summary
- Общая трудоёмкость: 118 человеко-часов
- Количество шагов: 11
- Модулей: 13

---

## Шаг 1 (~3 ч)
Можно делать ПАРАЛЛЕЛЬНО:
  - core-models (2ч) - тип: models, зависит от: -
  - utils (1ч) - тип: utils, зависит от: -

## Шаг 2 (~4 ч)

  - transforms (2ч) - тип: transforms, зависит от: utils
  - odata-query (2ч) - тип: query, зависит от: utils

## Шаг 3 (~5 ч)
Можно начать миграцию:
  - audit (5ч) - тип: models, зависит от: transforms, core-models

## Шаг 4 (~5 ч)
Можно начать миграцию:
  - generated-models (5ч) - тип: models, зависит от: core-models, audit

## Шаг 5 (~7 ч)
Можно начать миграцию:
  - regenerated-mixins (7ч) - тип: mixins, зависит от: core-models, generated-models

## Шаг 6 (~14 ч)
Можно делать ПАРАЛЛЕЛЬНО:
  - offline (8ч) - тип: offline, зависит от: core-models, offline-store, utils
  - offline-store (6ч) - тип: stores, зависит от: core-models, offline, utils

## Шаг 7 (~12 ч)
Можно начать миграцию:
  - odata (12ч) - тип: adapters, зависит от: core-models, offline, odata-query

## Шаг 8 (~7 ч)
Можно начать миграцию:
  - serializers-base (7ч) - тип: serializers, зависит от: core-models, offline, odata

## Шаг 9 (~6 ч)
Можно начать миграцию:
  - services (6ч) - тип: services, зависит от: core-models, offline, offline-store, utils

## Шаг 10 (~3 ч)
Можно начать миграцию:
  - initializers (3ч) - тип: initializers, зависит от: core-models, offline-store, services

## Шаг 11 (~2 ч)
Можно начать миграцию:
  - instance-initializers (2ч) - тип: initializers, зависит от: services

=== ИТОГО: 11 шагов, 118 часов ===
