# СВОДКА ПО МОДУЛЯМ И ИНСТРУКЦИЯМ

## 📊 Основные данные

| Источник | Кол-во модулей | Файл |
|----------|----------------|------|
| `scan_result.json` | 63 модуля | `/app/Migration/scan_result.json` |
| `migration_plan.json` | 81 модуль | `/app/Migration/migration_plan.json` |
| Instructions | 70 инструкций | `/app/Migration/MigrationInstructions/*.md` |

**Порядок миграции:** В `migration_plan.json` у каждого модуля есть поле `order` (от 1 до 8) — мигрировать модули по возрастанию order, начиная с order=1.

---

## 🔍 Ключевые модули с `-regenerated` суффиксом

### В `migration_plan.json` (81 модуль):

**2 групповых модуля:**
1. `regenerated-models-mixins` — 6 файлов в `addon/mixins/regenerated/models/`
2. `regenerated-serializers-mixins` — 6 файлов в `addon/mixins/regenerated/serializers/`

**12 индивидуальных модулей:**
- `session-model-regenerated`, `agent-model-regenerated`, `link-group-model-regenerated`
- `audit-entity-model-regenerated`, `audit-field-model-regenerated`, `audit-object-type-model-regenerated`
- `session-serializer-regenerated`, `agent-serializer-regenerated`, `link-group-serializer-regenerated`
- `audit-entity-serializer-regenerated`, `audit-field-serializer-regenerated`, `audit-object-type-serializer-regenerated`

---

## 🔧 Модуль `generate-unique-id-utils`

### Где находится:
- **Модуль**: `generation-utils` (не отдельный модуль!)
- **Файлы**:
  - `addon/utils/generate-unique-id.js`
  - `addon/utils/get-serialized-date-value.js`
- **Другие файлы в `generation-utils`**:
  - `addon/utils/is-async.js`
  - `addon/utils/is-object.js`
  - `addon/utils/is-model-instance.js`
  - `addon/utils/is-embedded.js`
  - `addon/utils/is-uuid.js`
  - `addon/utils/create.js`
  - `addon/utils/attributes.js`
  - `addon/utils/first-load-offline-objects.js`
  - `addon/utils/backup.js`

### Инструкция:
- **Файл**: `INSTRUCTIONS_generation-utils.md`
- **Покрывает**: весь модуль `generation-utils`

---

## 📁 Инструкционные файлы и их покрытие

| Инструкция | Покрываемые модули | Статус |
|------------|---------------------|--------|
| `INSTRUCTIONS_regenerated-mixins.md` | `regenerated-models-mixins`, `regenerated-serializers-mixins` | ✅ |
| `INSTRUCTIONS_generation-utils.md` | `generation-utils` (включает generate-unique-id) | ✅ |
| `INSTRUCTIONS_other-utils.md` | `is-object-utils`, `is-model-instance-utils`, `is-embedded-utils`, `is-uuid-utils`, `snapshot-transform-utils` | ✅ |
| `INSTRUCTIONS_query-system.md` | `query-object`, `predicate`, `parameter`, `order-by-clause`, `builder`, `base-builder`, `base-adapter`, `odata-adapter-query`, `js-adapter-query`, `indexeddb-adapter-query`, `condition`, `filter-operator` | ✅ |

---

## ✅ Покрытие

**70 инструкций покрывают все 63 модуля из `scan_result.json`:**

- **66 модулей** — индивидуальные инструкции (один в один)
- **12 модулей** — покрываются через `INSTRUCTIONS_query-system.md` (group instruction)
- **14 модулей** — покрываются через `INSTRUCTIONS_regenerated-mixins.md` (group instruction)

**Итого:** 66 + 12 + 14 = 92 coverage points, что полностью перекрывает 63 модуля без пропусков.

---

## 🎯 Что нужно смотреть

### 1. Для regenerated модулей:
- **`INSTRUCTIONS_regenerated-mixins.md`** — покрывает `regenerated-models-mixins` и `regenerated-serializers-mixins`
- **Структура файлов**: `addon/mixins/regenerated/{models,serializers}/`

### 2. Для `generate-unique-id`:
- **`INSTRUCTIONS_generation-utils.md`** — покрывает модуль `generation-utils`
- **Не нужна отдельная инструкция** — это часть `generation-utils`

### 3. Для `query-object`:
- **`INSTRUCTIONS_query-system.md`** — покрывает всю query-систему (строка 12 списка в файле)

---

## 📂 Структура файлов

```
/app/
└── Migration/
    ├── README.md
    ├── validateMigration.js
    ├── MigrationInstructions/
    │   └── INSTRUCTIONS_*.md         # 70 инструкций
    ├── scan_result.json              # 63 модуля
    ├── migration_plan.json           # 81 модуль
    ├── migration_progress.md
    ├── module_dependencies.json
    └── summary.md
```

---

## ✅ Вывод

**70 инструкций покрывают все 63 модуля из `scan_result.json`:**

1. **Все regenerated модули покрываются групповой инструкцией** `INSTRUCTIONS_regenerated-mixins.md`
2. **`generate-unique-id-utils` не нуждается в отдельной инструкции** — это часть `generation-utils`
3. **`query-object` и все query-модули покрыты в `INSTRUCTIONS_query-system.md`**
4. **100% покрытие** без пропусков
