# Модуль: attributes-utils

## Файлы
- addon/utils/attributes.js

## Зависимости (должны быть перенесены ДО этого модуля)
- create-utils

## Рекомендации по переносу

### Utils → Pure Functions or Class Methods

**Ember:** `addon/utils/attributes.js` → **Next.js:** `src/utils/attributes.ts`

**Пример шаблона:**
```ts
// utils/attributes.ts
import { merge } from '@ember/polyfills'; // или lodash.merge
import createProj from './create';

export function attr(caption: string, options?: any) {
  return createAttr('attr', caption, options);
}

export function belongsTo(
  modelName: string,
  caption: string,
  attributes: any,
  options?: any
) {
  const attr = createAttr('belongsTo', caption, options);
  const proj = createProj(modelName, attributes);
  return merge(attr, proj);
}

export function hasMany(
  modelName: string,
  caption: string,
  attributes: any,
  options?: any
) {
  const attr = createAttr('hasMany', caption, options);
  const proj = createProj(modelName, attributes);
  return merge(attr, proj);
}

function createAttr(kind: string, caption: string, options: any = {}) {
  return {
    kind,
    caption,
    options
  };
}
```

### Projection System → TypeScript Interfaces or Class Schema

**Ember projection** → **Next.js:** TypeScript interfaces или класс-модель

```ts
// types/projection.ts
export interface ProjectionAttribute {
  kind: 'attr' | 'belongsTo' | 'hasMany';
  caption: string;
  options?: any;
}

export interface Projection {
  projectionName?: string;
  modelName: string;
  attributes: Record<string, ProjectionAttribute>;
}

// Использование:
export const userProjection: Projection = {
  modelName: 'user',
  attributes: {
    id: attr('ID'),
    name: attr('Name'),
    posts: hasMany('post', 'Posts', { /* attributes */ })
  }
};
```

## Порядок действий при переносе

1. Перенести `create-utils` (обязательно!)
2. Создать utils функции: `attr()`, `belongsTo()`, `hasMany()`
3. Создать систему проекций (TypeScript interfaces)
4. Убедиться, что `merge()` импорт заменён (lodash или native)

## Оценка трудозатрат

≈ 2–4 часа (low)

## Чек-лист для разработчика

- [ ] `create-utils` перенесён
- [ ] `attr()` функция реализована
- [ ] `belongsTo()` функция реализована
- [ ] `hasMany()` функция реализована
- [ ] Projection system → TypeScript interfaces
- [ ] `merge()` импорт обновлён
- [ ] Тесты переписаны

## Примечания

- Утилиты Ember → чистые TypeScript функции
- Projection → TypeScript interfaces или class schema
