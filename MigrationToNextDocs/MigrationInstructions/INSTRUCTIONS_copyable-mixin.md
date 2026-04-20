# Модуль: copyable-mixin

## Файлы
- addon/mixins/copyable.js

## Зависимости (должны быть перенесены ДО этого модуля)
- generate-unique-id-utils

## Рекомендации по переносу

### Mixin → TypeScript Function or Decorator

**Ember:** `Mixin.create({})` → **Next.js:** `src/mixins/copyableMixin.ts`

**Пример шаблона:**
```ts
// mixins/copyableMixin.ts
import generateUniqueId from '../utils/generateUniqueId';

export function CopyableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    prototypeProjection?: string;

    // Copy record by prototype
    async copy(prototypeProjection?: string): Promise<any> {
      if (!prototypeProjection) {
        prototypeProjection = this.prototypeProjection;
      }

      if (!prototypeProjection) {
        throw new Error('Prototype projection is undefined.');
      }

      const store = this.store; // assuming store available
      const modelName = this.constructor.modelName;

      const prototype = await store.findRecord(modelName, this.id, { 
        reload: true, 
        projection: prototypeProjection 
      });

      return prototype._getCopy(prototypeProjection);
    }

    // Internal copy method
    _getCopy(aggregatorMeta?: any): any {
      const store = this.store;
      const modelName = this.constructor.modelName;

      const record = store.createRecord(modelName, { id: generateUniqueId() });

      // Copy attributes
      this.eachAttribute((name: string) => {
        const value = this.get?.(name) ?? this[name];
        record.set?.(name, value) ?? (record[name] = value);
      });

      // Copy relationships
      this.eachRelationship?.((name: string, meta: any) => {
        const key = meta.key;

        if (meta.kind === 'belongsTo') {
          const inverse = meta.options?.inverse;
          if (aggregatorMeta && aggregatorMeta.type === meta.type && aggregatorMeta.key === inverse) {
            return;
          }

          const value = this.get?.(key) ?? this[key];
          record.set?.(key, value) ?? (record[key] = value);
        } else if (meta.kind === 'hasMany') {
          const values = this.get?.(key) ?? this[key];
          if (Array.isArray(values)) {
            values.forEach((prototype: any) => {
              const detail = prototype._getCopy({ key, type: modelName });
              record.get?.(key)?.pushObject?.(detail) ?? record[key]?.push(detail);
            });
          }
        }
      });

      return record;
    }
  };
}

// Использование:
// class MyModel extends CopyableMixin(OfflineModel) {
//   // ...
// }
```

## Порядок действий при переносе

1. Перенести `generate-unique-id-utils`
2. Создать `CopyableMixin` функцию
3. Реализовать `copy()` method
4. Реализовать `_getCopy()` internal method
5. Обработать relationships (belongsTo, hasMany)

## Оценка трудозатрат

≈ 4-6 часов (medium)

## Чек-лист для разработчика

- [ ] `generate-unique-id-utils` перенесён
- [ ] `CopyableMixin` реализован
- [ ] `copy()` method
- [ ] `_getCopy()` method с relationships
- [ ] Тесты переписаны

## Примечания

- Ember relationships → TypeScript class properties
- `eachAttribute()`, `eachRelationship()` → обход свойств
