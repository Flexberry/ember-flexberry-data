# Миграция: utils/* (остальные файлы)

## Общая информация
Остальные файлы utils модуля (кроме batch-queries.js).

### 1. Исходные файлы (Ember)
```
// addon/utils/attributes.js
// addon/utils/backup.js
// addon/utils/create.js
// addon/utils/enum-functions.js
// addon/utils/first-load-offline-objects.js
// addon/utils/generate-unique-id.js
// addon/utils/get-serialized-date-value.js
// addon/utils/information.js
// addon/utils/is-async.js
// addon/utils/is-embedded.js
// addon/utils/is-model-instance.js
// addon/utils/is-object.js
// addon/utils/is-uuid.js
// addon/utils/model-functions.js
// addon/utils/queue.js
// addon/utils/reload-local-records.js
// addon/utils/snapshot-transform.js
// addon/utils/string-functions.js
```

### 2. Целевые файлы (Next.js 16)
- `app/lib/utils/*.ts` — functions

### 3. Маппинг Ember → Next.js
- `EmberObject.extend({...})` → `export function <name>()` function

### 4. Зависимости
- typescript
- zod (валидация)

### 5. Алгоритм миграции
1. Создать папку `app/lib/utils/`
2. Для каждого файла создать его

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/utils/attributes.ts
export function getAttributes() {
  // Implementation
}

// app/lib/utils/backup.ts
export function createBackup() {
  // Implementation
}

// app/lib/utils/create.ts
export function createRecord() {
  // Implementation
}

// app/lib/utils/enum-functions.ts
export function getEnumValue() {
  // Implementation
}

// app/lib/utils/first-load-offline-objects.ts
export function getFirstLoadObjects() {
  // Implementation
}

// app/lib/utils/generate-unique-id.ts
export function generateUniqueId() {
  // Implementation
}

// app/lib/utils/get-serialized-date-value.ts
export function getSerializedDateValue() {
  // Implementation
}

// app/lib/utils/information.ts
export function getInformation() {
  // Implementation
}

// app/lib/utils/is-async.ts
export function isAsync() {
  // Implementation
}

// app/lib/utils/is-embedded.ts
export function isEmbedded() {
  // Implementation
}

// app/lib/utils/is-model-instance.ts
export function isModelInstance() {
  // Implementation
}

// app/lib/utils/is-object.ts
export function isObject() {
  // Implementation
}

// app/lib/utils/is-uuid.ts
export function isUUID() {
  // Implementation
}

// app/lib/utils/model-functions.ts
export function getModelFunction() {
  // Implementation
}

// app/lib/utils/queue.ts
export function createQueue() {
  // Implementation
}

// app/lib/utils/reload-local-records.ts
export function reloadLocalRecords() {
  // Implementation
}

// app/lib/utils/snapshot-transform.ts
export function snapshotTransform() {
  // Implementation
}

// app/lib/utils/string-functions.ts
export function formatString() {
  // Implementation
}
```

### 7. Чек-лист валидации
- [ ] Файлы `*.ts` созданы
- [ ] Functions работают корректно
