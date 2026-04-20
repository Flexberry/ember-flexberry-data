# Модуль: audit-model-mixin

## Файлы
- addon/mixins/audit-model.js

## Зависимости (должны быть перенесены ДО этого модуля)
- offline-globals-service (для `userService` lookup)
- user-service (для `getCurrentUserName`)

## Рекомендации по переносу

### Mixins → TypeScript Mixins или Class Decorators

**Ember:** `addon/mixins/audit-model.js` → **Next.js:** TypeScript mixin pattern

**Пример шаблона:**
```ts
// mixins/auditModelMixin.ts
import { get } from '@ember/object';

export function AuditModelMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createTime?: Date;
    creator?: string;
    editTime?: Date;
    editor?: string;

    get currentUserName(): string {
      const userService = getOwner(this).lookup('service:user');
      return userService.getCurrentUserName();
    }

    save() {
      const _super = super.save.bind(this);
      const currentDate = new Date();
      
      // ... логика установки аудит-полей
    }
  };
}
```

### Computed Properties → TypeScript Getters

**Ember:** `computed(function() { ... })` → **Next.js:** `get propertyName() { ... }`

```ts
// Пример:
get currentUserName() {
  const userService = getOwner(this).lookup('service:user');
  return userService.getCurrentUserName();
}
```

### RSVP.Promise → Native Promise

**Ember:** `new RSVP.Promise((resolve, reject) => { ... })` → **Next.js:** `new Promise((resolve, reject) => { ... })` или `async/await`

```ts
async save() {
  await super.save();
  // ... логика
}
```

### Model Attributes → TypeScript Class Properties

**Ember:** `DS.attr('date')` → **Next.js:** `@attr('date') propertyName?: Date`

```ts
class AuditModel {
  @attr('date') createTime?: Date;
  @attr('string') creator?: string;
  @attr('date') editTime?: Date;
  @attr('string') editor?: string;
}
```

## Порядок действий при переносе

1. Создать `AuditModelMixin` на TypeScript (с композицией или декораторами)
2. Реализовать `currentUserName` getter с lookup сервиса
3. Реализовать `save()` метод с аудит-логикой
4. Создать декораторы `@attr()` для атрибутов Ember-моделей
5. Убедиться, что `user-service` перенесён (для `getCurrentUserName`)
6. Переписать тесты

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `user-service` перенесён (для `getCurrentUserName`)
- [ ] `AuditModelMixin` реализован на TypeScript
- [ ] `currentUserName` → getter с правильным lookup
- [ ] `save()` метод с аудит-логикой перенесён
- [ ] `DS.attr()` → декораторы `@attr()` или class properties
- [ ] RSVP.Promise → native Promise или async/await
- [ ] Ember computed → TypeScript getters
- [ ] Все Ember-импорты заменены на Next.js/TypeScript импорты
- [ ] Тесты переписаны

## Примечания

- Ember mixin с `Mixin.create()` → TypeScript mixin с функцией высшего порядка
- `getOwner(this).lookup()` → dependency injection (constructor injection или декоратор)
- RSVP → native Promise (`RSVP.resolve()` → `Promise.resolve()`)
