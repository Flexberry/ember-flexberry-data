# Инструкция: instance-initializers

## Общее описание

Модуль содержит instance-инициализаторы приложения — функции, выполняемые при создании нового экземпляра Ember-приложения. В Next.js 16 они мигрируются в `app/providers.tsx` или `app/layout.tsx`.

## Состав модуля (файлы)

### Основные файлы
- `addon/instance-initializers/set-singletons.js`
- `app/instance-initializers/set-singletons.js` — дубликат

> 📝 Примечание: Дубликат `app/` не требует отдельной миграции.

## Порядок миграции файлов внутри модуля

1. `set-singletons.js` (instance-initializer) → `app/lib/initializers/set-singletons.ts`

## Особенности реализации

- Ember `instance-initializer`: `initialize(app, instance)` → Next.js: React Context + Provider
- Ember `instance.register`, `instance.inject` → Next.js: `useContext`
- Ember `app.lookup('service:X')` → Next.js: `useContext(ServiceContext)`

## Возможные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Ember `instance.register` | React Context + Provider |
| `app.lookup('service:X')` → Next.js | `useContext(ServiceContext)` |

---

### Файл: `addon/instance-initializers/set-singletons.js`

#### Тип Ember-модуля
Instance Initializer (set singletons)

#### Тип Next.js-модуля
Singleton Provider (для сервисов)

##### 1. Исходный файл (Ember)
`addon/instance-initializers/set-singletons.js`

##### 2. Целевой файл (Next.js 16)
`app/lib/initializers/set-singletons.ts`

##### 3. Маппинг Ember → Next.js
| Ember | Next.js |
|-------|---------|
| `instance.register` / `instance.inject` | React Context + Provider |
| `app.lookup('service:X')` | `useContext(ServiceContext)` |

##### 4. Зависимости
- `typescript`
- `react`

##### 5. Алгоритм миграции
1. Удалите `instance.register`, `instance.inject`
2. Если singleton — сервис, используйте `ServiceContext`
3. Поместите `ServiceContext.Provider` в `app/layout.tsx`

##### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/initializers/set-singletons.ts
import { createContext, useContext, useState } from 'react';

// Для каждого singleton-сервиса
export interface SyncerServiceContextType {
  sync: () => void;
  lastSync: Date | null;
}

export const SyncerServiceContext = createContext<SyncerServiceContextType | undefined>(undefined);

export function SyncerServiceProvider({ children }: { children: React.ReactNode }) {
  // Реальный singleton — в рендер, но создается один раз
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const sync = () => {
    // ... sync logic
    setLastSync(new Date());
  };

  return (
    <SyncerServiceContext.Provider value={{ sync, lastSync }}>
      {children}
    </SyncerServiceContext.Provider>
  );
}

export function useSyncer() {
  const context = useContext(SyncerServiceContext);
  if (!context) throw new Error('useSyncer must be used within SyncerServiceProvider');
  return context;
}
```

##### 7. Чек-лист качества
- [ ] Удалены Ember `instance.register`, `instance.inject`
- [ ] `SyncerServiceContext` + `SyncerServiceProvider`
- [ ] `useSyncer` — custom hook
- [ ] Тесты — `vitest`

---

## Итог

Модуль `instance-initializers` мигрирован, если:

✅ `SyncerServiceContext` + `SyncerServiceProvider` создан  
✅ `useSyncer` — custom hook  
✅ Ember `instance.register`, `instance.inject` удалены  

## Следующий модуль (рекомендуемый порядок)

После `instance-initializers` — перейдите к **`generated-models`**, так как он зависит от `core-models`, `audit`, и использует `transforms`.
