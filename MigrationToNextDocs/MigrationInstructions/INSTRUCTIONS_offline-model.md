# Модуль: offline-model

## Файлы
- addon/models/offline-model.js
- app/models/offline-model.js

## Зависимости (должны быть перенесены ДО этого модуля)
- model
- offline-model-mixin
- attributes-utils

## Рекомендации по переносу

### Model → Class with Mixin Composition

**Ember:** `OfflineModel.extend(Mixin)` → **Next.js:** `src/models/offlineModel.ts`

**Пример шаблона:**
```ts
// models/offlineModel.ts
import { Model } from './model';
import { OfflineModelMixin } from '../mixins/offlineModelMixin';
import { attr } from '../decorators/attr';

// Композиция mixin'ов через расширение класса
export class OfflineModel extends OfflineModelMixin(Model) {
  // Атрибуты из offline-model-mixin
  @attr('date') syncDownTime?: Date;
  @attr('boolean') readOnly?: boolean;

  // Пример save override
  async save(): Promise<void> {
    // Логика из mixin
    if (this.readOnly) {
      throw new Error('Attempt to save readonly model instance.');
    }
    // ... остальная логика
    await super.save();
  }
}
```

## Порядок действий при переносе

1. Перенести `model`, `offline-model-mixin`, `attributes-utils`
2. Создать `OfflineModel` класс
3. Композиция mixin через расширение класса
4. Добавить атрибуты из mixin

## Оценка трудозатрат

≈ 6–8 часов (medium)

## Чек-лист для разработчика

- [ ] all dependencies перенесены
- [ ] `OfflineModel` класс создан
- [ ] Mixin composition через расширение
- [ ] Атрибуты из mixin добавлены
- [ ] Тесты переписаны

## Примечания

- Mixin composition: `class Model extends Mixin(BaseClass)`
- Ember mixin.create() → TypeScript mixin pattern
