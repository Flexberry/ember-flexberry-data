# Миграция: специфичные mixins (audit-model, adapter, store)

## Типы Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### Общая информация
Специфичные mixins (audit-model, adapter, store) содержат кастомную логику для соответствующих компонентов.

### 1. Исходные файлы (Ember)
```
// addon/mixins/audit-model.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  auditEnabled: true,
  // Логика для audit модели
});

// addon/mixins/adapter.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Логика для адаптеров
});

// addon/mixins/store.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Логика для store
});
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/hooks/useAuditModel.ts`
- `app/lib/hooks/useAdapter.ts`
- `app/lib/hooks/useStore.ts`

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function use<Model|Adapter|Store>()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Для каждого mixin создать файл с hook
3. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useAuditModel.ts
import { useState, useCallback } from 'react';

export function useAuditModel<T extends { id: string }>() {
  const [auditEnabled, setAuditEnabled] = useState(true);
  const [auditLog, setAuditLog] = useState<Log[]>([]);

  const addLog = useCallback((action: string, data: any) => {
    if (!auditEnabled) return;
    setAuditLog(prev => [...prev, { action, data, timestamp: Date.now() }]);
  }, [auditEnabled]);

  const clearLog = useCallback(() => {
    setAuditLog([]);
  }, []);

  return {
    auditEnabled,
    setAuditEnabled,
    auditLog,
    addLog,
    clearLog,
  };
}

// app/lib/hooks/useAdapter.ts
export function useAdapter() {
  const [retryCount, setRetryCount] = useState(0);
  
  const onRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    retryCount,
    onRetry,
  };
}

// app/lib/hooks/useStore.ts
import { useQueryClient } from '@tanstack/react-query';

export function useStore() {
  const queryClient = useQueryClient();
  
  const invalidate = useCallback((modelName: string) => {
    queryClient.invalidateQueries({ queryKey: [modelName] });
  }, [queryClient]);

  return {
    invalidate,
  };
}
```

### 7. Чек-лист валидации
- [ ] Файлы `useAuditModel.ts`, `useAdapter.ts`, `useStore.ts` созданы
- [ ] Для каждого hook используются правильные зависимости (useState, useCallback, useQueryClient)
- [ ] В компонентах использовать соответствующие hooks
