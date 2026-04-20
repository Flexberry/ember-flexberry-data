# Миграция модуля regenerated-serializers

## Общая информация
Модуль `regenerated-serializers` содержит сгенерированные сериализаторы (audit и security). В Next.js 16 они преобразуются в функции трансформации.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Serializer | TS function + axios transformResponse |

## Файлы модуля (6 файлов)
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
- addon/mixins/regenerated/serializers/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js

## Маппинг Ember → Next.js
- `Serializer.extend({...})` → `export function transform<Name>Response()` function
- Используется как основа `transformOdataResponse`

## Порядок миграции
1. Использовать общую инструкцию `serializer-common.ts` для всех сериализаторов

## Как использовать в Next.js
Для каждого сериализатора создать функцию `transform<Name>Response`.

Пример:
```typescript
export function transformAuditEntityResponse(data: any): T {
  return transformOdataResponse<T>(data);
}
```

## Примеры кода
См. `INSTRUCTIONS_addon-serializers-special.js.md`

## Зависимости
- @tanstack/react-query
- react
- typescript
- axios

## Чек-лист
- [ ] Все файлы модуля обработаны
- [ ] Функции трансформации работают корректно
- [ ] Используется `transformOdataResponse` как база
