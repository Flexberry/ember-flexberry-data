# Модуль: offline-model-mixin

## Файлы
- addon/mixins/offline-model.js
- app/models/offline-model.js

## Зависимости (должны быть перенесены ДО этого модуля)
- audit-model-mixin (обязательно)
- offline-globals-service (обязательно)
- snapshot-transform-utils (обязательно)
- attributes-utils (для `attr`, `belongsTo`, `hasMany`)

## Рекомендации по переносу

### Mixins → TypeScript Mixins или Class Decorators

**Ember:** `addon/mixins/offline-model.js` → **Next.js:** TypeScript mixin pattern

**Пример шаблона:**
```ts
// mixins/offlineModelMixin.ts
import { DS } from '@ember-data/model';

export function OfflineModelMixin<TBase extends Constructor<DS.Model>>(Base: TBase) {
  return class extends Base {
    syncDownTime: Date;
    readOnly: boolean;
    syncer: any; // Injected via decorator

    save() {
      // ... перенесённая логика из Ember
    }
  };
}

// Использование:
class MyModel extends OfflineModelMixin(SomeBaseModel) {
  // ...
}
```

### Injection Service → Decorator or Constructor Injection

**Ember:** `service('syncer')` → **Next.js:** `@InjectService('syncer')`

```ts
// decorators/injectService.ts
export function InjectService(serviceName: string) {
  return function(target: any, propertyKey: string) {
    // ... внедрение сервиса через конструктор или декоратор
  };
}
```

### Model Class → TypeScript Class with Inheritance

**Ember:** `app/models/offline-model.js` → **Next.js:** `src/models/offlineModel.ts`

```ts
// models/offlineModel.ts
import { OfflineModelMixin } from '../mixins/offlineModelMixin';
import { DS } from '@ember-data/model';

export class OfflineModel extends OfflineModelMixin(DS.Model) {
  // Атрибуты через декораторы или в конструкторе
  @attr('date') syncDownTime?: Date;
  @attr('boolean') readOnly?: boolean;
}
```

## Порядок действий при переносе

1. Перенести `audit-model-mixin` (базовый mixin для аудита)
2. Перенести `snapshot-transform-utils` (утилита трансформа снапшотов)
3. Перенести `attributes-utils` (функции `attr`, `belongsTo`, `hasMany`)
4. Создать декоратор `@InjectService` или паттерн внедрения зависимостей
5. Создать `OfflineModelMixin` на основе Ember- mixin
6. Создать `OfflineModel` class с наследованием от mixin
7. Переписать тесты для mixin и модели

## Оценка трудозатрат

≈ 6–8 часов (medium)

## Чек-лист для разработчика

- [ ] `audit-model-mixin` перенесён
- [ ] `snapshot-transform-utils` перенесён
- [ ] `attributes-utils` перенесён
- [ ] Создан декоратор `@InjectService` (или аналог)
- [ ] `OfflineModelMixin` реализован на TypeScript
- [ ] `OfflineModel` класс создан с правильным наследованием
- [ ] `DS.attr()` заменены на декораторы `@attr()` или эквивалент
- [ ] `mixin.create()` заменены на паттерн TypeScript mixin
- [ ] Ручное тестирование моков для syncer сервиса
- [ ] Все Ember-импорты заменены на Next.js/TypeScript импорты

## Примечания

- Ember-мixin с наследованием от `AuditModelMixin` → TypeScript mixin с композицией
- RSVP.Promise →native Promise или async/await
- Ember computed properties → TypeScript getters/setters или decorators
- Работа с `getOwner(this).lookup()` → dependency injection через конструктор или декоратор
