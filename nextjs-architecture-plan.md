# Архитектурный план переноса EmberJS аддона в NextJS

## Обзор функциональности EmberJS аддона

Аддон EmberJS предоставляет следующую функциональность:
1. Адаптеры для работы с различными бэкендами (OData, offline) - ✅
2. Сериализаторы для преобразования данных - ✅
3. Модели данных - ✅
4. Сервисы для синхронизации данных (syncer, offline-globals, user) - ✅
5. Утилиты для различных операций с данными - ✅
6. Поддержка работы с IndexedDB через Dexie - ✅ (реализована работа с IndexedDB API)
7. Поддержка запросов через JavaScript Query Language (JQL) - ✅ (реализованы Query Objects)
8. Поддержка оффлайн-режима - ✅ (реализована полная поддержка оффлайн-режима)

## Архитектурная структура NextJS версии

### 1. Структура проекта

```
ember-flexberry-data-nextjs/
├── src/
│   ├── adapters/
│   │   ├── odata.ts - ✅
│   │   └── offline.ts - ✅
│   ├── serializers/
│   │   ├── base.ts - ✅
│   │   ├── odata.ts - ✅
│   │   └── offline.ts - ✅
│   ├── models/
│   │   ├── base-model.ts - ✅
│   │   ├── index.ts
│   │   └── generated/
│   ├── services/
│   │   ├── syncer.ts - ✅
│   │   ├── offline-globals.ts - ✅
│   │   └── user.ts - ✅
│   ├── utils/
│   │   ├── attributes.ts
│   │   ├── backup.ts
│   │   ├── batch-queries.ts
│   │   ├── create.ts - ✅
│   │   ├── enum-functions.ts - ✅
│   │   ├── first-load-offline-objects.ts - ✅
│   │   ├── generate-unique-id.ts - ✅
│   │   ├── get-serialized-date-value.ts - ✅
│   │   ├── information.ts - ✅
│   │   ├── is-async.ts - ✅
│   │   ├── is-embedded.ts - ✅
│   │   ├── is-model-instance.ts - ✅
│   │   ├── is-object.ts - ✅
│   │   ├── is-uuid.ts - ✅
│   │   ├── model-functions.ts - ✅
│   │   ├── queue.ts - ✅
│   │   ├── reload-local-records.ts - ✅
│   │   ├── snapshot-transform.ts - ✅
│   │   └── string-functions.ts - ✅
│   ├── query/
│   │   ├── base-adapter.ts - ✅
│   │   ├── base-builder.ts - ✅
│   │   ├── builder.ts - ✅
│   │   ├── condition.ts - ✅
│   │   ├── filter-operator.ts - ✅
│   │   ├── indexeddb-adapter.ts - ✅
│   │   ├── js-adapter.ts - ✅
│   │   ├── odata-adapter.ts - ✅
│   │   ├── order-by-clause.ts - ✅
│   │   ├── parameter.ts - ✅
│   │   ├── predicate.ts - ✅
│   │   └── query-object.ts - ✅
│   ├── stores/
│   │   ├── base-store.ts - ✅
│   │   ├── local-store.ts - ✅
│   │   └── online-store.ts - ✅
│   ├── transforms/
│   │   ├── decimal.ts - ✅
│   │   ├── file.ts - ✅
│   │   ├── flexberry-enum.ts - ✅
│   │   ├── guid.ts - ✅
│   │   └── generated/ - ✅
│   └── types/
│       └── index.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 2. Основные компоненты и их эквиваленты

#### Адаптеры
- **OData адаптер**: Перенос в NextJS с использованием axios или fetch для HTTP-запросов - ✅
- **Offline адаптер**: Перенос с заменой Dexie на IndexedDB API или другую библиотеку для работы с IndexedDB - ✅

#### Сериализаторы
- **Base serializer**: Базовый класс для сериализации/десериализации данных - ✅
- **OData serializer**: Специфичный для OData формат - ✅
- **Offline serializer**: Для работы с оффлайн-данными - ✅

#### Модели данных
- **Базовая модель**: Класс для всех моделей данных - ✅
- **Модели сгенерированные автоматически**: Для каждого типа данных - ✅
- **Модели для оффлайн-режима**: Специальные модели для работы с локальным хранилищем - ✅

#### Сервисы
- **Syncer service**: Сервис синхронизации данных между онлайн и оффлайн режимами - ✅
- **Offline globals service**: Глобальные настройки для оффлайн-режима - ✅
- **User service**: Сервис работы с пользовательскими данными - ✅

#### Утилиты
- Все утилиты будут перенесены как функции/классы в TypeScript - ✅

#### Запросы (Query)
- **Base adapter**: Базовый класс для работы с запросами - ✅
- **Builder**: Конструктор запросов - ✅
- **Predicates**: Предикаты для фильтрации данных - ✅
- **Query objects**: Объекты запросов - ✅

#### Хранилища (Stores)
- **Base store**: Базовое хранилище - ✅
- **Local store**: Локальное хранилище (IndexedDB) - ✅
- **Online store**: Онлайн хранилище (сервер) - ✅

#### Трансформеры
- **Decimal transform**: Преобразование десятичных чисел - ✅
- **File transform**: Работа с файлами - ✅
- **Enum transform**: Работа с перечислениями - ✅
- **GUID transform**: Работа с GUID - ✅

### 3. Замены технологий

#### Замена Ember.js
- Ember Object → TypeScript classes - ✅
- Ember Services → TypeScript classes с DI - ✅
- Ember Mixins → TypeScript interfaces/abstract classes - ✅
- Ember Computed Properties → getters/setters или функции - ✅

#### Замена Dexie
- IndexedDB API + библиотека для работы с IndexedDB (например, idb или dexie-js для Node.js) - ✅

#### Замена Ember Data
- Использование библиотеки для работы с данными (например, Prisma, TypeORM или кастомная реализация) - ✅

#### Замена Ember CLI
- Использование TypeScript + Webpack/Vite для сборки - ✅

### 4. Особенности реализации

#### Работа с асинхронностью
- Замена RSVP на Promise - ✅
- Замена Ember.runloop на стандартные асинхронные методы - ✅

#### Работа с HTTP
- Замена jQuery.ajax на axios или fetch API - ✅

#### Работа с маршрутизацией
- Замена Ember Router на NextJS API Routes или клиентскую маршрутизацию - ✅

#### Работа с состоянием
- Замена Ember State Manager на Redux/Context API или Zustand - ✅

### 5. Интеграция с NextJS

#### API Routes
- Создание API endpoint для взаимодействия с сервером - ✅
- Реализация CRUD операций через API - ✅

#### Middleware
- Возможность использования middleware для обработки запросов - ✅

#### SSR/SSG
- Поддержка серверного рендеринга - ✅

### 6. Тестирование

- Unit тесты с Jest - ✅
- Integration тесты - ✅
- E2E тесты с Cypress или Playwright - ⚠️ (частично реализовано)

### 7. Документация

- Автоматическая генерация документации - ✅
- Примеры использования - ✅
- Руководства по миграции - ✅
