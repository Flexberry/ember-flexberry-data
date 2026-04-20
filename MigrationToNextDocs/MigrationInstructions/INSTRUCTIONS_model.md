# Модуль: model

## Файлы
- addon/models/model.js
- app/models/model.js

## Зависимости (должны быть перенесены ДО этого модуля)
- model-without-validation

## Рекомендации по переносу

### Model → TypeScript Class extends Base Model

**Ember:** `DS.Model.extend({})` → **Next.js:** `src/models/model.ts`

**Пример шаблона:**
```ts
// models/model.ts
import { OfflineModel } from './offlineModel';
import { attr } from '../decorators/attr';

export class Model extends OfflineModel {
  // Пример атрибутов с декораторами
  @attr('string') id?: string;
  @attr('date') createTime?: Date;
  @attr('string') creator?: string;
  @attr('date') editTime?: Date;
  @attr('string') editor?: string;

  // or via constructor for more complex setup
  constructor() {
    super();
    // initialize default values if needed
  }

  // Override save method if needed
  async save(): Promise<void> {
    await super.save();
    // ... additional save logic
  }
}
```

## Порядок действий при переносе

1. Перенести `model-without-validation`
2. Создать `Model` класс
3. Наследование от `OfflineModel`
4. Добавить атрибуты через декораторы

## Оценка трудозатрат

≈ 2–4 часа (low)

## Чек-лист для разработчика

- [ ] `model-without-validation` перенесён
- [ ] `Model` класс создан
- [ ] Наследование от `OfflineModel`
- [ ] Атрибуты добавлены
- [ ] Тесты переписаны

## Примечания

- Простое наследование
- Декораторы `@attr()` или class properties
