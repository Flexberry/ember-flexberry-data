# Миграция: addon/mixins/offline-model.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```
// addon/mixins/offline-model.js
import Mixin from '@ember/object/mixin';
import { underscore } from '@ember/string';

export default Mixin.create({
  isOffline: false,
  
  save() {
    if (this.get('isOffline')) {
      return this.saveOffline();
    }
    return this._super(...arguments);
  },
  
  saveOffline() {
    // Сохранение в IndexedDB
  },
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useOfflineModel.ts` — custom hook для оффлайн модели

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function useOfflineModel()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- idb

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useOfflineModel.ts` с hook
3. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useOfflineModel.ts
import { useState, useCallback } from 'react';
import { saveRecordOffline, getRecordOffline, deleteRecordOffline } from '@/lib/db/indexeddb';

export function useOfflineModel<T extends { id: string | number }>() {
  const [isOffline, setIsOffline] = useState(false);

  const saveOffline = useCallback(async (modelName: string, model: T) => {
    await saveRecordOffline(modelName, model.id, model);
    return model;
  }, []);

  const loadOffline = useCallback(async <R extends T>(modelName: string, id: string | number): Promise<R | null> => {
    return await getRecordOffline<R>(modelName, id);
  }, []);

  const deleteOffline = useCallback(async (modelName: string, id: string | number) => {
    await deleteRecordOffline(modelName, id);
    setIsOffline(true);
  }, []);

  const setIsOfflineMode = useCallback((value: boolean) => {
    setIsOffline(value);
  }, []);

  return {
    isOffline,
    saveOffline,
    loadOffline,
    deleteOffline,
    setIsOfflineMode,
  };
}

// Использование в компоненте
import { useOfflineModel } from '@/lib/hooks/useOfflineModel';

export function AuditEntityOfflineForm({ modelName, entity }: { modelName: string; entity: AuditEntity }) {
  const { isOffline, saveOffline, setIsOfflineMode } = useOfflineModel<AuditEntity>();
  
  const onSave = async () => {
    if (isOffline) {
      await saveOffline(modelName, entity);
    } else {
      // Сохранение онлайн через API
      await apiClient.post(`/${modelName}`, entity);
    }
  };
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isOffline}
          onChange={(e) => setIsOfflineMode(e.target.checked)}
        />
        Save offline
      </label>
      <button onClick={onSave}>Save</button>
    </div>
  );
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/hooks/useOfflineModel.ts` создан с hook
- [ ] Использует `saveRecordOffline`, `getRecordOffline`, `deleteRecordOffline`
- [ ] В компоненте использовать `isOffline`, `saveOffline`, `setIsOfflineMode`
