# Миграция: i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js

## Тип Ember → Next.js
- Ember тип: enum
- Next.js аналог: TypeScript const object / enum

### 1. Исходный файл (Ember)
```
// addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
export default EmberObject.freeze({
  None: 0,
  Manual: 1,
  Automatic: 2,
});
```

```
// app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant.js
// (обычно дублирует addon/...)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/enums/execution-variant.ts` — TypeScript const object

### 3. Маппинг Ember → Next.js
- `EmberObject.freeze({...})` → `export const ExecutionVariant = {...} as const`

### 4. Зависимости
- typescript
- react

### 5. Алгоритм миграции
1. Создать папку `app/lib/enums/`
2. Создать файл `execution-variant.ts` с const object
3. Использовать в компонентах и запросах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/enums/execution-variant.ts
/**
 * Типы вариантов выполнения (Execution Variant)
 * Ember: i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant
 */
export const ExecutionVariant = {
  None: 0,
  Manual: 1,
  Automatic: 2,
} as const;

export type ExecutionVariantType = typeof ExecutionVariant[keyof typeof ExecutionVariant];

// Пример использования
import { ExecutionVariant, ExecutionVariantType } from '@/lib/enums/execution-variant';

// В компоненте
const [executionVariant, setExecutionVariant] = useState<ExecutionVariantType>(ExecutionVariant.None);

// В запросе
const queryData = {
  executionVariant: ExecutionVariant.Automatic,
};

// Проверка значений
function isExecutionVariant(value: unknown): value is ExecutionVariantType {
  return Object.values(ExecutionVariant).includes(value as ExecutionVariantType);
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/enums/execution-variant.ts` создан с const object
- [ ] Создан тип `ExecutionVariantType` для TypeScript
- [ ] Используется `as const` для неизменяемости
- [ ] Проверки значений работают корректно
