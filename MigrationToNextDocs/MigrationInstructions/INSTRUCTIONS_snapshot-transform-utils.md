# Модуль: snapshot-transform-utils

## Файлы
- addon/utils/snapshot-transform.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (простая утилита)

## Рекомендации по переносу

### Utility → TypeScript Object/Function

**Ember:** ES6 module → **Next.js:** `src/utils/snapshotTransform.ts`

**Пример шаблона:**
```ts
// utils/snapshotTransform.ts
export const SnapshotTransform = {
  /**
   * Transform snapshot for serialization (remove unchanged attributes)
   * @param snapshot - Ember Data snapshot object
   * @param skipUnchangedAttrs - whether to skip unchanged attributes (default: true)
   */
  transformForSerialize(snapshot: any, skipUnchangedAttrs: boolean = true): any {
    if (skipUnchangedAttrs) {
      const changedAttributes = Object.keys(snapshot.changedAttributes());
      
      for (const attrKey in snapshot._attributes) {
        const attrIsChanged = changedAttributes.indexOf(attrKey) !== -1;
        if (!attrIsChanged) {
          delete snapshot._attributes[attrKey];
        }
      }

      snapshot.eachAttribute = function(callback: Function, binding: any): any {
        if (!snapshot.record) {
          return snapshot;
        } else {
          snapshot.record.eachAttribute(function(name: string, meta: any): void {
            if (name in snapshot._attributes) {
              callback.call(binding, name, meta);
            }
          }, binding);
        }
      };
    }

    return snapshot;
  }
};

// Usage
SnapshotTransform.transformForSerialize(snapshot, true);
```

## Порядок действий при переносе

1. Создать `snapshotTransform.ts` файл
2. Реализовать `transformForSerialize` метод
3. Поддержать пропуск unchanged атрибутов
4. TypeScript типы для snapshot

## Оценка трудозатрат

≈ 2-3 часа (low)

## Чек-лист для разработчика

- [ ] `SnapshotTransform` объект создан
- [ ] `transformForSerialize` метод реализован
- [ ] TypeScript типы добавлены
- [ ] Тесты переписаны

## Примечания

- Используется в оффлайн и оndata адаптерах
- Помогает оптимизировать размер payload при сериализации
