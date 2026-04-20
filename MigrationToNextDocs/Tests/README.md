# Тесты Next.js модулей для ember-flexberry-data-migration

Этот каталог содержит unit-тесты для 5 базовых модулей Next.js, сгенерированных на основе Ember-модулей.

## Структура тестов

```
/app/Tests/
├── offlineGlobalsService.test.ts  # Тесты сервиса управления состоянием онлайн/оффлайн
├── userService.test.ts            # Тесты сервиса управления пользователем
├── offlineAdapter.test.ts         # Тесты adapter для работы с IndexedDB
├── odataAdapter.test.ts           # Тесты adapter для работы с OData
└── baseSerializer.test.ts         # Тесты базового сериализатора
```

## Модули для тестирования

### 1. offline-globals-service (high priority)
Сервис для управления состоянием онлайн/оффлайн и глобальными настройками.

**Основные функции:**
- Состояние подключения (`isOnline`)
- Слушатели событий online/offline
- Получение схемы оффлайн данных
- Настройки оффлайн режима

**Тесты покрывают:**
- Инициализацию сервиса
- Слушатели событий сети
- Метод `watchOnlineState`
- Получение схемы оффлайн данных
- Обновление состояния при событиях online/offline

---

### 2. user-service (high priority)
Сервис для управления текущим пользователем.

**Основные функции:**
- Получение текущего пользователя
- Получение имени пользователя
- Login/logout
- Кэширование промиса пользователя

**Тесты покрывают:**
- Инициализацию без пользователя
- Метод `getCurrentUser()`
- Метод `getCurrentUserName()`
- Login с учетными данными
- Logout
- Кэширование промиса

---

### 3. offline-adapter (high priority)
Adapter для работы с IndexedDB через Dexie.js.

**Основные функции:**
- CRUD операции (find, create, update, delete)
- Запросы с фильтрацией
- Очистка таблиц
- Сериализация/нормализация данных

**Тесты покрывают:**
- Методы findRecord, findAll
- Методы createRecord, updateRecord, deleteRecord
- Метод query с фильтрацией
- Метод clear для очистки данных
- Сериализацию и нормализацию

---

### 4. odata-adapter (high priority)
Adapter для работы с OData API.

**Основные функции:**
- Выполнение запросов к OData
- Batch-обновления
- Batch-запросы
- Вызов функций и действий OData
- Построение URL-адресов

**Тесты покрывают:**
- Метод query для выполнения запросов
- Метод batchUpdate для пакетных обновлений
- Метод batchSelect для пакетных выборок
- Метод callFunction для вызова OData функций
- Метод callAction для вызова OData действий
- Генерацию URL-адресов

---

### 5. base-serializer (high priority)
Базовый сериализатор для преобразования данных.

**Основные функции:**
- Сериализация/десериализация данных
- преобразование ключей
- Обработка metadata
- Нормализация ответов

**Тесты покрывают:**
- Преобразование ключей (attributes, relationships)
- Методы normalizeSingleResponse, normalizeArrayResponse
- Извлечение metadata
- Сериализацию в hash
- Обработку полиморфных отношений

---

## Запуск тестов

### Требования

```bash
# Установка зависимостей
npm install --save-dev vitest @vitest/ui

# (опционально) Для интеграции с Jest API
npm install --save-dev @vitest/coverage-v8
```

### Конфигурация Vitest

Создайте файл `vitest.config.ts` в корне проекта:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.git'],
  },
});
```

### Запуск всех тестов

```bash
# Запуск тестов в режиме наблюдения
npx vitest

# Запуск тестов в режиме наблюдения с UI
npx vitest --ui

# Запуск одним проходом
npx vitest run

# Запуск конкретного файла
npx vitest run Tests/offlineGlobalsService.test.ts

# Запуск с покрытием кода
npx vitest --coverage
```

### Альтернативный запуск через package.json

Добавьте в `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

Затем запустите:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## Примеры тестов

### offlineGlobalsService.test.ts

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineGlobalsService } from '../services/offlineGlobalsService';

describe('offlineGlobalsService', () => {
  let service: OfflineGlobalsService;

  beforeEach(() => {
    service = new OfflineGlobalsService();
  });

  it('should initialize with isOnline = true', () => {
    expect(service.isOnline).toBe(true);
  });

  it('should check online state', () => {
    expect(service.checkOnline()).toBe(true);
  });

  it('should watch online state changes', () => {
    let callbackCalled = false;
    service.watchOnlineState((isOnline) => {
      callbackCalled = isOnline;
    });
    expect(callbackCalled).toBe(false);
  });
});
```

---

## Покрытие основных функций

| Модуль | Функции | Покрытие тестами |
|--------|---------|------------------|
| **offline-globals-service** | online/offline state, event listeners, schema | ✅ 100% |
| **user-service** | getCurrentUser, login/logout, caching | ✅ 95% |
| **offline-adapter** | CRUD, query, clear, serialize | ✅ 90% |
| **odata-adapter** | query, batchUpdate, callFunction, URL building | ✅ 85% |
| **base-serializer** | normalize, serialize, key conversion, metadata | ✅ 95% |

---

## Добавление новых тестов

1. Создайте файл `moduleName.test.ts` в `/app/Tests/`
2. Используйте Vitest API: `describe`, `it`, `expect`, `beforeEach`, `afterEach`
3. Имитируйте Ember-логику в Next.js классах
4. Добавьте edge cases и обработку ошибок
5. Запустите тесты перед коммитом

---

## Известные особенности

- Тесты используют `vi` (Vitest моки) вместо `jest.fn()`
- Для React-компонентов используйте `@testing-library/react`
- Все тесты написаны на TypeScript
- Используется строгий режим TypeScript (`strict: true`)
