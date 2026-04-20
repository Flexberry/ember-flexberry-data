# Миграция модуля models

## Общая информация
Модуль `models` содержит модели Ember Data. В Next.js 16 они преобразуются в TypeScript interfaces и custom hooks для работы с данными.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Model | TypeScript interface + hooks (useQuery, useMutation) |

## Связи между файлами
- `model.js` — базовая модель
- `offline-model.js` — оффлайн модель (наследуется от model)
- `model-without-validation.js` — модель без валидации
- Специфичные модели (audit-entity, audit-field, object-type, agent, link-group, session)

## Порядок миграции внутри модуля
1. `model.js` — базовая модель (основа)
2. `offline-model.js` — оффлайн модель
3. `model-without-validation.js` — модель без валидации
4. Специфичные модели (audit-entity, audit-field, object-type, agent, link-group, session)

## Как использовать в Next.js
Для каждой модели создать:
- `app/lib/types/<model>.ts` — TypeScript interface
- `app/lib/hooks/use<Model>Query.ts` — custom hooks для queries
- `app/lib/hooks/use<Model>Mutation.ts` — custom hooks для mutations

## Примеры маппинга Ember → Next.js
| Ember Pattern | Next.js Pattern |
|---------------|----------------|
| `Model.extend({...})` | `export interface <Model> { ... }` |
| `attr('string')` | `name: string` |
| `hasMany('related-model')` | `relatedModels: RelatedModel[]` |
| `belongsTo('related-model')` | `relatedModel: RelatedModel | null` |

## Файлы модуля
- addon/models/model.js
- addon/models/offline-model.js
- addon/models/model-without-validation.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group.js
- addon/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session.js
- app/models/*.js (дубликаты)
