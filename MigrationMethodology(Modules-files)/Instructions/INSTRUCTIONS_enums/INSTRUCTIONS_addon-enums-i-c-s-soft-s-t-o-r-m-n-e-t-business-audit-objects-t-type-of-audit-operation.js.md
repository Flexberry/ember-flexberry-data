# Миграция: i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js

## Тип Ember → Next.js
- Ember тип: enum
- Next.js аналог: TypeScript const object / enum

### 1. Исходный файл (Ember)
```
// addon/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
export default EmberObject.freeze({
  Insert: 1,
  Update: 2,
  Delete: 3,
});
```

```
// app/enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation.js
// (обычно дублирует addon/...)
```

### 2. Целевой файл (Next.js 16)
- `app/lib/enums/type-of-audit-operation.ts` — TypeScript const object

### 3. Маппинг Ember → Next.js
- `EmberObject.freeze({...})` → `export const TypeOfAuditOperation = {...} as const`

### 4. Зависимости
- typescript
- react

### 5. Алгоритм миграции
1. Создать папку `app/lib/enums/`
2. Создать файл `type-of-audit-operation.ts` с const object
3. Использовать в компонентах и запросах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/enums/type-of-audit-operation.ts
/**
 * Типы операций аудита (Type of Audit Operation)
 * Ember: i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation
 */
export const TypeOfAuditOperation = {
  Insert: 1,
  Update: 2,
  Delete: 3,
} as const;

export type TypeOfAuditOperationType = typeof TypeOfAuditOperation[keyof typeof TypeOfAuditOperation];

// Пример использования
import { TypeOfAuditOperation, TypeOfAuditOperationType } from '@/lib/enums/type-of-audit-operation';

// В компоненте
const [auditOperation, setAuditOperation] = useState<TypeOfAuditOperationType>(TypeOfAuditOperation.Insert);

// В запросе
const auditData = {
  operationType: TypeOfAuditOperation.Update,
};

// Проверка значений
function isAuditOperationType(value: unknown): value is TypeOfAuditOperationType {
  return Object.values(TypeOfAuditOperation).includes(value as TypeOfAuditOperationType);
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/enums/type-of-audit-operation.ts` создан с const object
- [ ] Создан тип `TypeOfAuditOperationType` для TypeScript
- [ ] Используется `as const` для неизменяемости
- [ ] Проверки значений работают корректно
