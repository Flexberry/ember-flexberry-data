# Модуль: model-without-validation

## Файлы
- addon/models/model-without-validation.js
- app/models/model-without-validation.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовая модель)

## Рекомендации по переносу

### Model Base Class → TypeScript Base Class

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/modelWithoutValidation.ts`

**Пример шаблона:**
```ts
// models/modelWithoutValidation.ts
import { OfflineModel } from './offlineModel';

export class ModelWithoutValidation extends OfflineModel {
  // Базовая модель без валидации
  // Атрибуты будут добавлены в дочерних классах

  // Можно добавить общие методы
  toString(): string {
    return `[Model: ${this.constructor.name} id=${this.id}]`;
  }

  // Пример общего поведения
  isNew(): boolean {
    return !this.id || this.id === '' || this.id === 'new';
  }
}
```

## Порядок действий при переносе

1. Создать `ModelWithoutValidation` класс
2. Наследование от `OfflineModel`
3. Добавить общие методы

## Оценка трудозатрат

≈ 2–4 часа (low)

## Чек-лист для разработчика

- [ ] `ModelWithoutValidation` класс создан
- [ ] Наследование от `OfflineModel`
- [ ] Общие методы добавлены
- [ ] Тесты переписаны

## Примечания

- Base class для всех моделей
- Расширяется в `model.js`
