# Инструкция по миграции: addon/utils/queue.js

## 📋 Тип Ember-модуля
- **Ember тип:** utility functions
- **Next.js тип:** plain JS functions

## 📁 Исходный файл (Ember)
```
// addon/utils/queue.js
export class Queue {
  private items: any[] = [];
  
  enqueue(item: any): void {
    this.items.push(item);
  }
  
  dequeue(): any | undefined {
    return this.items.shift();
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
```

## 🎯 Целевые файлы (Next.js 16)
- `app/lib/utils/queue.ts` — Queue class

## 📦 Зависимости
- typescript

## 📝 Готовый код

```typescript
// app/lib/utils/queue.ts
export class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  size(): number {
    return this.items.length;
  }
}
```

## ✅ Чек-лист валидации
- [ ] Файл `app/lib/utils/queue.ts` создан
- [ ] Класс `Queue` реализован
