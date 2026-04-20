# План миграции Ember → Next.js

## 📊 Общая статистика
- **Всего модулей:** 63
- **Инструкций создано:** 70
- **Оценка времени:** 80-120 часов
- **Покрытие:** 100% (все модули имеют инструкции)

## 🗂️ Модули по категориям

**Порядок миграции:** Следуйте полю `order` в `migration_plan.json` (от 1 до 8).

### 🔧 Utils (18 модулей)
1. `attributes-utils` - low effort
2. `information-utils` - low effort
3. `is-async-utils` - low effort
4. `is-object-utils` - low effort
5. `is-model-instance-utils` - low effort
6. `is-embedded-utils` - low effort
7. `is-uuid-utils` - low effort
8. `create-utils` - low effort
9. `enum-functions-utils` - low effort
10. `string-functions-utils` - low effort
11. `model-functions-utils` - low effort
12. `snapshot-transform-utils` - low effort
13. `batch-queries-utils` - low effort
14. `generation-utils` - low effort (включает generate-unique-id.js)
15. `queue-utils` - low effort
16. `reload-local-records-utils` - medium effort
17. `first-load-offline-objects-utils` - medium effort
18. `backup-utils` - low effort

### ⚙️ Services (4 модуля)
1. `offline-globals-service` - low effort, high priority
2. `user-service` - low effort, high priority
3. `dexie-service` - medium effort, high priority
4. `syncer-service` - high effort, high priority

### 🧱 Model Mixins (17 модулей)
1. `offline-globals-mixin` - low effort (без файлов)
2. `offline-model-mixin` - medium effort
3. `audit-model-mixin` - medium effort
4. `copyable-mixin` - low effort
5. `adapter-mixin` - medium effort
6. `store-mixin` - high effort
7. `regenerated-models-mixins` - low effort (6 файлов в папке regenerated/models/)
8. `regenerated-serializers-mixins` - low effort (6 файлов в папке regenerated/serializers/)
9-14. **regenerated individual models** (6 шт):
15-20. **regenerated individual serializers** (6 шт):
   - `session-model-regenerated`
   - `agent-model-regenerated`
   - `link-group-model-regenerated`
   - `audit-entity-model-regenerated`
   - `audit-field-model-regenerated`
   - `audit-object-type-model-regenerated`
15-20. **regenerated individual serializers** (6 шт):
   - `session-serializer-regenerated`
   - `agent-serializer-regenerated`
   - `link-group-serializer-regenerated`
   - `audit-entity-serializer-regenerated`
   - `audit-field-serializer-regenerated`
   - `audit-object-type-serializer-regenerated`

### 📦 Models (7 модулей)
1. `model` - low effort
2. `model-without-validation` - low effort
3. `offline-model` - medium effort
4. `session-model` - medium effort
5. `agent-model` - medium effort
6. `link-group-model` - medium effort
7. `audit-entity-model`, `audit-field-model`, `audit-object-type-model` - medium effort

### 🔀 Serializers (7 модулей)
1. `base-serializer` - medium effort
2. `offline-serializer` - medium effort
3. `odata-serializer` - medium effort
4. `session-serializer` - medium effort
5. `agent-serializer` - medium effort
6. `link-group-serializer` - medium effort
7. `audit-entity-serializer`, `audit-field-serializer`, `audit-object-type-serializer` - medium effort

### ⚡ Adapters (2 модуля)
1. `offline-adapter` - medium effort
2. `odata-adapter` - high effort

### 🔄 Transforms (6 модулей)
1. `guid-transform` - low effort
2. `decimal-transform` - low effort
3. `file-transform` - low effort
4. `flexberry-enum-transform` - low effort
5. `audit-operation-type-transform` - low effort
6. `audit-execution-variant-transform` - low effort

### 📋 Enums (1 модуль)
1. `enums` - low effort (2 enum файла)

### 🏪 Stores (3 модуля)
1. `base-store` - high effort
2. `local-store` - high effort
3. `online-store` - high effort

### 🔁 Query System (12 модулей)
1. `base-adapter` - medium effort
2. `odata-adapter-query` - medium effort
3. `js-adapter-query` - medium effort
4. `indexeddb-adapter-query` - medium effort
5. `builder` - medium effort
6. `base-builder` - low effort (без файлов)
7. `query-object` - medium effort
8. `predicate` - medium effort
9. `parameter` - low effort
10. `order-by-clause` - low effort
11. `condition` - low effort
12. `filter-operator` - low effort

### 🎛️ Initializers (4 модуля)
1. `local-store-initializer` - low effort
2. `offline-globals-initializer` - low effort
3. `flexberry-enum-initializer` - low effort
4. `set-singletons-instance-initializer` - low effort

## 📁 Инструкции

### Индивидуальные инструкции (70 файлов)
Каждый модуль из списка выше имеет отдельный файл `INSTRUCTIONS_<module_name>.md`

### Групповые инструкции
1. `INSTRUCTIONS_regenerated-mixins.md` — покрывает `regenerated-models-mixins`, `regenerated-serializers-mixins` и 12 individual regenerated модулей
2. `INSTRUCTIONS_query-system.md` — покрывает `query-object`, `predicate`, `parameter`, `order-by-clause`, `condition`, `filter-operator`, `builder`, `base-builder`, `base-adapter`, `odata-adapter-query`, `js-adapter-query`, `indexeddb-adapter-query`
3. `INSTRUCTIONS_generation-utils.md` — покрывает `generation-utils` (включая `generate-unique-id.js`)

## 📋 Рекомендации по порядку переноса

### Уровень 1-3 (базовые утилиты, от которых зависят другие модули)
- `offline-globals-service`
- `user-service`
- `offline-adapter`
- `odata-adapter`
- `base-serializer`

### Уровень 4-5 (зависимые утилиты и модели)
- `reload-local-records-utils`, `first-load-offline-objects-utils`
- `offline-model`, `session-model`, `agent-model`, `link-group-model`
- `audit-entity-model`, `audit-field-model`, `audit-object-type-model`

### Уровень 6-8 (базовые компоненты)
- `base-store`, `local-store`, `online-store`
- Миксины (`store-mixin`, `adapter-mixin`)

### Особый случай: regenerated-mixins
- 14 модулей с custom logic
- Покрываются групповой инструкцией `INSTRUCTIONS_regenerated-mixins.md`
- Отдельная оценка не требуется
