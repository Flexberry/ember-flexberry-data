# Миграция модуля mixins

## Общая информация
Модуль `mixins` содержит миксины для Ember Data. В Next.js 16 они преобразуются в Composition functions или Higher-order Components.

## Типы Ember → Next.js
| Ember Type | Next.js Analog |
|------------|----------------|
| Mixin | Composition function / HOC |

## Связи между файлами
- `adapter.js` — mixin для адаптеров
- `store.js` — mixin для store
- `audit-model.js` — mixin для audit модели
- `copyable.js` — mixin для копирования
- `offline-model.js` — mixin для оффлайн модели
- Сгенерированные модели (audit-entity, audit-field, object-type, agent, link-group, session)

## Порядок миграции внутри модуля
1. `adapter.js` — mixin для адаптеров
2. `store.js` — mixin для store
3. `audit-model.js` — mixin для audit модели
4. `copyable.js` — mixin для копирования
5. `offline-model.js` — mixin для оффлайн модели
6. Сгенерированные модели

## Как использовать в Next.js
Для каждого mixin создать Composition function.

Пример:
```typescript
export function withCopyable<T>(BaseComponent: React.ComponentType<T>) {
  return (props: T) => {
    const [copyValue, setCopyValue] = useState('');
    return <BaseComponent {...props} copyValue={copyValue} setCopyValue={setCopyValue} />;
  };
}
```

## Файлы модуля
- addon/mixins/adapter.js
- addon/mixins/store.js
- addon/mixins/audit-model.js
- addon/mixins/copyable.js
- addon/mixins/offline-model.js
- addon/mixins/regenerated/models/*.js (6 файлов)
- (в app/ нет дубликатов для mixin)
