# ember-flexberry-data-nextjs

Библиотека для работы с данными в NextJS приложениях с поддержкой OData.

## Установка

```bash
npm install ember-flexberry-data-nextjs
```

## Использование

### OData адаптер

```typescript
import { ODataAdapter } from 'ember-flexberry-data-nextjs/adapters/odata';

// Создание адаптера
const adapter = new ODataAdapter('http://your-odata-endpoint.com/odata');

// Пример использования с простым предикатом
const predicate = new SimplePredicate('name', FilterOperator.Eq, 'John');
const query = {
  predicate: predicate,
  modelName: 'User',
  select: ['id', 'name'],
  top: 10
};

// Получение полного URL для запроса
const fullUrl = adapter.getODataFullUrl(query);
console.log(fullUrl); // http://your-odata-endpoint.com/odata?$filter=name eq 'John'&$select=id,name&$top=10

// Выполнение запроса
const result = await adapter.findRecord(fullUrl);
```

### Поддерживаемые типы предикатов

- `SimplePredicate` - простые предикаты (равно, не равно, больше, меньше и т.д.)
- `ComplexPredicate` - сложные предикаты с логическими операторами AND/OR
- `StringPredicate` - предикаты для строковых значений (поиск подстроки)
- `DatePredicate` - предикаты для дат
- `DetailPredicate` - предикаты для деталей (связанных сущностей)
- `GeographyPredicate` - географические предикаты
- `GeometryPredicate` - геометрические предикаты
- `NotPredicate` - предикат "НЕ"
- `IsOfPredicate` - предикат проверки типа
- `TruePredicate` / `FalsePredicate` - предикаты истинности

### Поддерживаемые операторы фильтрации

- `Eq` - равно
- `Neq` - не равно
- `Le` - меньше
- `Leq` - меньше или равно
- `Ge` - больше
- `Geq` - больше или равно

### Поддерживаемые функции запросов

- `$filter` - фильтрация
- `$orderby` - сортировка
- `$skip` - пропуск записей
- `$top` - ограничение количества записей
- `$count` - подсчет записей
- `$select` - выборка полей
- `$expand` - расширение связей

## Тестирование

Для запуска тестов:

```bash
npm test
```

## Лицензия

MIT
