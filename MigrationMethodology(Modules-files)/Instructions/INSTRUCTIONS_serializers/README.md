# Миграция модуля serializers

## Общая информация
Модуль `serializers` содержит сериализаторы для Ember Data (base, odata, offline). В Next.js 16 они преобразуются в функции трансформации данных с axios и @tanstack/react-query.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Serializer | TS function + axios transformResponse |

## Связи между файлами
- `base.js` — базовый сериализатор
- `odata.js` — OData сериализатор (использует base)
- `offline.js` — Offline сериализатор (использует odata)
- Специфичные сериализаторы (audit-entity, audit-field, object-type, agent, link-group, session)

## Порядок миграции внутри модуля
1. `base.js` — базовый сериализатор (основа)
2. `odata.js` — OData сериализатор
3. `offline.js` — Offline сериализатор
4. Специфичные сериализаторы (audit-entity, audit-field, object-type, agent, link-group, session)

## Как использовать в Next.js
Для каждого сериализатора создать функцию `transformResponse` в axios.

Пример:
```typescript
const apiClient = axios.create({
  transformResponse: [(data) => transformOdataResponse(data)],
});
```

## Файлы модуля
- addon/serializers/base.js
- addon/serializers/odata.js
- addon/serializers/offline.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-offline.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field-offline.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type-offline.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent-offline.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
- addon/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
- app/serializers/base.js, odata.js, offline.js
- app/serializers/*.js (дубликаты для специфичных)
