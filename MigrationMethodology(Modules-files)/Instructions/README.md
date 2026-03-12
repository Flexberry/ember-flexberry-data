# Инструкция: ember-flexberry-data5

## Общая информация
Это проект по миграции модулей из Ember Data в Next.js 16.

## Структура Instructions/

Каждый модуль имеет свою папку с инструкциями:
- `INSTRUCTIONS_<module-name>/`
  - `README.md` — общий алгоритм миграции модуля
  - `INSTRUCTIONS_<filename>.md` — пошаговые инструкции для каждого файла

## Как работать с инструкциями

1. Изучи `README.md` модуля — там общий обзор
2. Следуй порядку миграции файлов, указанному в README
3. Для каждого файла используй `INSTRUCTIONS_<filename>.md` с детальным гайдом
4. После завершения — проверь чек-листом валидации

## Технологии Next.js 16

- `@tanstack/react-query` — для работы с данными
- `react` + `typescript` — для UI и типизации
- `zod` — для валидации
- `axios` — для HTTP запросов
- `vitest` — для тестирования
- `next` — для структуры проекта

## Порядок миграции модулей (из migration_steps.md)

1. **Шаг 1** (параллельно): transforms, enums, utils, regenerated-serializers
2. **Шаг 2** (после Шага 1): models, mixins
3. **Шаг 3** (после Шага 2): serializers, query-builder, adapters
4. **Шаг 4** (после Шага 3): stores
5. **Шаг 5** (после Шага 4): services, local-store-initializer, initializers
6. **Шаг 6** (после Шага 5): flexberry-enum-initializer, offline-globals-initializer
7. **Шаг 7** (после Шага 6): instance-initializers

## Примечания

- Файлы в `addon/` и `app/` с одинаковым содержанием — это дубликаты после build.
- Основная логика должна быть в `addon/`.
- `app/` используется для переопределений и адаптации.

## 📊 Статистика миграции (финал)

**Всего файлов в scan_result:** 143  
**Всего созданных инструкций:** 147  
**Покрытие:** 100% (с учетом group-инструкций)

### Модули по категории:

| Категория | Файлы | Инструкции |
|-----------|-------|------------|
| **core** (serializers, adapters, stores) | 49 | 50 |
| **data** (models, mixins, transforms, enums) | 45 | 49 |
| **logic** (utils, query-builder, services) | 61 | 63 |
| **setup** (initializers, instance-initializers) | 12 | 14 |
| **regenerated** (regenerated-serializers) | 6 | 7 |
| **custom** (offline-globals, flexberry-enum) | 8 | 10 |

## Вопросы и поддержка

Если есть сложности — смотри примеры в `INSTRUCTIONS_*` файлах и проверяй чек-листы.
