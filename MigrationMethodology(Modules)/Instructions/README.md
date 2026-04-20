# Инструкции по миграции ember-flexberry-data2GenModules → Next.js 16

## Общая информация

Этот репозиторий содержит пошаговые инструкции по миграции Ember.js-модулей в современную версию Next.js (v16).

Проект: **ember-flexberry-data2GenModules**  
Дата сканирования: **2026-03-11**

## Архитектура миграции

Все Ember-паттерны заменяются на современные Next.js 16 решения:
- **Ember Services** → React Context + хук
- **Ember Models** → TypeScript-интерфейсы + `@tanstack/react-query`
- **Ember Adapters/Serializers** → `axios`/`fetch` + кастомные хуки
- **Computed properties** → `useMemo`/`useCallback`
- **Ember Store** → `QueryClient`

## Список инструкций

| Модуль | Описание | Файлов | Зависимости | Инструкция |
|--------|----------|--------|-------------|------------|
| `core-models` | Базовые модели данных и их расширения | 6 | — | `INSTRUCTIONS_core-models.md` |
| `generated-models` | Автогенерированные модели для бизнес-сущностей | 12 | `core-models`, `audit` | `INSTRUCTIONS_generated-models.md` |
| `regenerated-mixins` | Миксины с автогенерированными атрибутами | 12 | `core-models`, `generated-models` | `INSTRUCTIONS_regenerated-mixins.md` |
| `audit` | Модель аудита и изменения | 10 | `transforms`, `core-models` | `INSTRUCTIONS_audit.md` |
| `offline` | Поддержка автономного режима (с Offline Mode и `dexie`) | 11 | `core-models`, `offline-store`, `utils` | `INSTRUCTIONS_offline.md` |
| `offline-store` | Локальное хранилище данных (IndexedDB) | 5 | `core-models`, `offline`, `utils` | `INSTRUCTIONS_offline-store.md` |
| `odata` | Адаптер и сериализатор для OData | 16 | `core-models`, `offline`, `odata-query` | `INSTRUCTIONS_odata.md` |
| `odata-query` | Система построения запросов OData | 13 | `utils` | `INSTRUCTIONS_odata-query.md` |
| `services` | Ember-сервисы (`syncer`, `offline-globals`, `user`) | 8 | `core-models`, `offline`, `offline-store`, `utils` | `INSTRUCTIONS_services_serializers-base.md` |
| `serializers-base` | Базовый сериализатор и адаптации | 11 | `core-models`, `offline`, `odata` | `INSTRUCTIONS_services_serializers-base.md` |
| `transforms` | Преобразования типов данных | 12 | `utils` | `INSTRUCTIONS_transforms.md` |
| `initializers` | Инициализаторы приложения (`flexberry-enum`, `local-store`, `offline-globals`) | 6 | `core-models`, `offline-store`, `services` | `INSTRUCTIONS_initializers.md` |
| `instance-initializers` | Instance-инициализаторы приложения (`set-singletons`) | 2 | `services` | `INSTRUCTIONS_initializers.md` |
| `utils` | Утилитарные функции (`generate-unique-id`, `batch-queries`, `queue`, `enum-functions`) | 21 | — | `INSTRUCTIONS_utils.md` |

## Общие принципы миграции

### 1. Данные и state
- **Ember Data Store** → `@tanstack/react-query` (`QueryClient`)
- **Services** → React Context + `useQuery`, `useMutation`
- **Computed** → `useMemo`, `useCallback`

### 2. API-коммуникация
- **Ember Adapters** → `axios`/`fetch` + кастомные хуки
- **Serializers** → inline-преобразования в `queryFn`

### 3. Файловая структура Next.js
```
app/
├── lib/
│   ├── hooks/                # custom hooks
│   ├── types/                # TypeScript interfaces
│   ├── api/                  # axios/fetch клиенты
│   └── utils/                # утилиты (без Ember)
├── providers/                # QueryClientProvider, AuthProvider и др.
└── [pages]/                  # route-компоненты
```

## Основные библиотеки (обязательны к установке)

```bash
npm install @tanstack/react-query react-query-devtools
npm install zod axios
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## Порядок миграции модулей

Рекомендуемая последовательность (на основе зависимостей):
1. `core-models`
2. `utils`
3. `transforms`
4. `initializers`
5. `instance-initializers`
6. `generated-models`
7. `regenerated-mixins`
8. `audit`
9. `offline-store`
10. `offline`
11. `odata-query`
12. `odata`
13. `services`
14. `serializers-base`

> ⚠️ **Важно:** Модули-зависимости мигрируются **до** тех, что от них зависят.

## Чек-лист после миграции каждого модуля

- [ ] Все Ember-библиотеки (`@ember/*`, `ember-data`) удалены
- [ ] TypeScript-интерфейсы созданы для всех сущностей
- [ ] Используется `@tanstack/react-query` для всех асинхронных запросов
- [ ] Сервисы реализованы через React Context + хук
- [ ] Computed свойства — через `useMemo`
- [ ] Утилиты — чистые JS/TS функции, без зависимости от Ember
- [ ] Тесты написаны через `vitest` + `@testing-library/react`
- [ ] Все API-вызовы — через `axios` или `fetch`
- [ ] Данные валидируются через `zod`

## Помощь и поддержка

- Проблемы с миграцией? Сверьтесь с конкретной инструкцией (`INSTRUCTIONS_<module-name>.md`)
- Не вижу модуля в списке — проверьте файл `scan_result.json`
- Нашли ошибку в инструкции — создайте issue или PR в репозитории проекта.
