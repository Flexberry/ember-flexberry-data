# План миграции модулей ember-flexberry-data5

## Группировка по приоритетам

### High приоритет (базовые модули без внешних зависимостей)

| Модуль | Тип | Оценка | Зависимости |
|--------|-----|--------|-------------|
| transforms | transform | 3ч | - |
| enums | enum | 1ч | - |
| utils | utils | 2ч | create, information |
| regenerated-serializers | serializer | 8ч | - |
| models | model | 5ч | transforms, utils |
| mixins | mixin | 6ч | models, utils |
| serializers | serializer | 8ч | models, mixins, utils |
| query-builder | query | 2ч | serializers, utils |
| adapters | adapter | 12ч | query-builder, serializers, utils |
| stores | store | 6ч | adapters, serializers, mixins, query-builder |
| services | service | 6ч | stores, utils |

**Итого по High приоритету:** 11 модулей, 61 ч

### Medium приоритет (модули с зависимостями внутри проекта)

| Модуль | Тип | Оценка | Зависимости |
|--------|-----|--------|-------------|
| flexberry-enum-initializer | initializer | 3.5ч | transforms |
| offline-globals-initializer | initializer | 3.5ч | services |
| local-store-initializer | initializer | 3.5ч | stores |
| instance-initializers | instance-initializer | 2.5ч | services |
| initializers | initializer | 3.5ч | stores |

**Итого по Medium приоритету:** 5 модулей, 16.5 ч

### Low приоритет (нет модулей с внешними зависимостями)

**Итого по Low приоритету:** 0 модулей, 0 ч

---

## Группировка по типам

### adapter (1 модуль, 12 ч)
- adapters (12ч) - зависимость: query-builder, serializers, utils

### serializer (2 модуля, 16 ч)
- serializers (8ч) - зависимость: models, mixins, utils
- regenerated-serializers (8ч) - зависимость: -

### model (1 модуль, 5 ч)
- models (5ч) - зависимость: transforms, utils

### mixin (1 модуль, 6 ч)
- mixins (6ч) - зависимость: models, utils

### transform (1 модуль, 3 ч)
- transforms (3ч) - зависимость: -

### utils (1 модуль, 2 ч)
- utils (2ч) - зависимость: create, information

### service (1 модуль, 6 ч)
- services (6ч) - зависимость: stores, utils

### initializer (5 модулей, 16.5 ч)
- flexberry-enum-initializer (3.5ч) - зависимость: transforms
- offline-globals-initializer (3.5ч) - зависимость: services
- local-store-initializer (3.5ч) - зависимость: stores
- initializers (3.5ч) - зависимость: stores
- instance-initializers (2.5ч) - зависимость: services

### instance-initializer (1 модуль, 2.5 ч)
- instance-initializers (2.5ч) - зависимость: services

### query (1 модуль, 2 ч)
- query-builder (2ч) - зависимость: serializers, utils

### store (1 модуль, 6 ч)
- stores (6ч) - зависимость: adapters, serializers, mixins, query-builder

### enum (1 модуль, 1 ч)
- enums (1ч) - зависимость: -
