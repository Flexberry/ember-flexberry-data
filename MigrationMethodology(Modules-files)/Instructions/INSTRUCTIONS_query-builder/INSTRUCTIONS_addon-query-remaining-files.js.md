# Миграция: query/base-builder.js, query/builder.js, query/condition.js, query/predicate.js, query/filter-operator.js, query/order-by-clause.js, query/parameter.js

## Общая информация
Остальные файлы query-builder.

### 1. Исходные файлы (Ember)
```
// addon/query/base-builder.js
// addon/query/builder.js
// addon/query/condition.js
// addon/query/predicate.js
// addon/query/filter-operator.js
// addon/query/order-by-clause.js
// addon/query/parameter.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/query/*.ts` — functions

### 3. Маппинг Ember → Next.js
- `BaseBuilder.extend({...})` → `export function buildQuery()` function
- `Condition.create()` → `export function createCondition()` function
- `Predicate.create()` → `export function createPredicate()` function
- `OrderByClause.create()` → `export function createOrderByClause()` function
- `Parameter.create()` → `export function createParameter()` function

### 4. Зависимости
- @tanstack/react-query
- react
- typescript

### 5. Алгоритм миграции
1. Создать папку `app/lib/query/`
2. Для каждого файла создать его с соответствующим именем

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/query/base-builder.ts
export function buildBaseQuery() {
  // Implementation
}

// app/lib/query/builder.ts
export function buildODataQuery() {
  // Implementation
}

// app/lib/query/condition.ts
export function createCondition() {
  // Implementation
}

// app/lib/query/predicate.ts
export function createPredicate() {
  // Implementation
}

// app/lib/query/filter-operator.ts
export function createFilterOperator() {
  // Implementation
}

// app/lib/query/order-by-clause.ts
export function createOrderByClause() {
  // Implementation
}

// app/lib/query/parameter.ts
export function createParameter() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файлы `*.ts` созданы
- [ ] Functions работают корректно
