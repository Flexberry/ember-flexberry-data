# Модуль: queue-utils

## Файлы
- addon/utils/queue.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基础 utilities)

## Рекомендации по переносу

### Queue Class → TypeScript Class or Async Queue

**Ember:** `addon/utils/queue.js` (EmberObject.extend) → **Next.js:** `src/utils/queue.ts`

**Пример шаблона:**
```ts
// utils/queue.ts
export class Queue {
  private _queue: Promise<any>[] = [];
  public continueOnError: boolean = true;

  constructor() {
    this._queue = [Promise.resolve()];
  }

  attach(callback: (resolve: (val?: any) => void, reject: (reason?: any) => void) => void): Promise<any> {
    const queueKey = this._queue.length;

    this._queue[queueKey] = this._queue[queueKey - 1]
      .then(() => new Promise((resolve, reject) => callback(resolve, reject)))
      .catch((reason) => {
        if (this.continueOnError) {
          console.warn(`Promise in queue was rejected with reason: "${reason}"`);
          return undefined;
        } else {
          throw reason;
        }
      });

    return this._queue[queueKey];
  }
}

// Использование:
// const queue = new Queue();
// await queue.attach((resolve, reject) => {
//   // ... async operation
//   resolve();
// });
```

## Порядок действий при переносе

1. Создать `Queue` класс
2. Реализовать цепочку промисов
3. Обработать `continueOnError` логику

## Оценка трудозатрат

≈ 3–4 часов (medium)

## Чек-лист для разработчика

- [ ] `Queue` класс создан
- [ ] Цепочка промисов работает
- [ ] `continueOnError` логика сохранена
- [ ] Тесты переписаны

## Примечания

- EmberObject.extend → TypeScript class
- RSVP Promise → native Promise
