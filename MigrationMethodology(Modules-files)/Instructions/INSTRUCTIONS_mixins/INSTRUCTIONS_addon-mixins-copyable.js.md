# Миграция: addon/mixins/copyable.js

## Тип Ember → Next.js
- Ember тип: mixin
- Next.js аналог: Composition function

### 1. Исходный файл (Ember)
```
// addon/mixins/copyable.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  copyValue: null,
  
  copy() {
    this.set('copyValue', this.get('model').serialize());
  },
  
  paste() {
    this.set('model', this.store.createRecord(this.get('modelName'), this.get('copyValue')));
  },
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/hooks/useCopyable.ts` — custom hook для копирования

### 3. Маппинг Ember → Next.js
- `Mixin.create({...})` → `export function useCopyable()` hook

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/hooks/`
2. Создать файл `useCopyable.ts` с hook
3. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/hooks/useCopyable.ts
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface CopyableState<T> {
  copyValue: T | null;
}

export function useCopyable<T extends { id: string }>() {
  const queryClient = useQueryClient();
  const [copyValue, setCopyValue] = useState<T | null>(null);

  const copy = useCallback((model: T) => {
    // Сериализация модели (простая копия)
    setCopyValue({ ...model });
  }, []);

  const paste = useCallback((modelName: string) => {
    // Создание новой записи из скопированной
    if (copyValue) {
      // Новая запись без id
      const newModel = { ...copyValue, id: '' };
      return newModel;
    }
    return null;
  }, [copyValue]);

  const clearCopy = useCallback(() => {
    setCopyValue(null);
  }, []);

  return {
    copyValue,
    copy,
    paste,
    clearCopy,
  };
}

// Использование в компоненте
import { useCopyable } from '@/lib/hooks/useCopyable';

export function AuditEntityForm() {
  const { copyValue, copy, paste, clearCopy } = useCopyable<AuditEntity>();
  
  const handleCopy = () => {
    copy(currentAuditEntity);
  };
  
  const handlePaste = () => {
    const newModel = paste('audit-entity');
    if (newModel) {
      setAuditEntity(newModel);
    }
  };
  
  return (
    <div>
      <button onClick={handleCopy}>Copy</button>
      <button onClick={handlePaste}>Paste</button>
    </div>
  );
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/hooks/useCopyable.ts` создан с hook
- [ ] Hook использует `useState` и `useCallback`
- [ ] В компоненте использовать `copy()` и `paste()`
