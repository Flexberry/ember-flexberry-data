/**
 * Примеры использования библиотеки
 */

import {
  ODataAdapter,
  OfflineAdapter,
  ODataSerializer,
  OfflineSerializer,
  LocalStore,
  OnlineStore,
  DecimalTransform,
  GuidTransform,
  FlexberryEnumTransform,
  SyncerService,
  OfflineGlobalsService,
  UserService,
  container
} from './index';

/**
 * Пример использования OData адаптера
 */
export async function exampleODataAdapter(): Promise<void> {
  const adapter = new ODataAdapter('https://api.example.com');

  try {
    // Получение записи
    const record = await adapter.findRecord('/employees/1');
    console.log('Полученная запись:', record);

    // Создание записи
    const newRecord = await adapter.createRecord('/employees', {
      name: 'Иван Петров',
      position: 'Программист'
    });
    console.log('Созданная запись:', newRecord);

  } catch (error) {
    console.error('Ошибка при работе с OData адаптером:', error);
  }
}

/**
 * Пример использования Offline адаптера
 */
export async function exampleOfflineAdapter(): Promise<void> {
  const adapter = new OfflineAdapter('my-db', 1);

  try {
    // Создание записи
    const result = await adapter.createRecord('employees', {
      id: '1',
      name: 'Иван Петров',
      position: 'Программист'
    });
    console.log('Созданная запись:', result);

    // Получение записей
    const records = await adapter.findRecord('employees');
    console.log('Все записи:', records);

  } catch (error) {
    console.error('Ошибка при работе с Offline адаптером:', error);
  }
}

/**
 * Пример использования сериализаторов
 */
export function exampleSerializers(): void {
  const odataSerializer = new ODataSerializer();
  const offlineSerializer = new OfflineSerializer();

  const testData = {
    id: '1',
    name: 'Иван Петров',
    salary: 50000,
    hireDate: new Date('2023-01-15')
  };

  // Сериализация для OData
  const serializedOData = odataSerializer.serialize(testData);
  console.log('Сериализованные данные (OData):', serializedOData);

  // Сериализация для оффлайн
  const serializedOffline = offlineSerializer.serialize(testData);
  console.log('Сериализованные данные (Offline):', serializedOffline);

  // Десериализация
  const deserialized = odataSerializer.deserialize(serializedOData);
  console.log('Десериализованные данные:', deserialized);
}

/**
 * Пример использования трансформеров
 */
export function exampleTransforms(): void {
  // Трансформер для десятичных чисел
  const decimalValue = DecimalTransform.serialize('123.45');
  console.log('Десятичное число:', decimalValue);

  const decimalString = DecimalTransform.deserialize(123.45);
  console.log('Строка из числа:', decimalString);

  // Трансформер для GUID
  const guid = GuidTransform.serialize(null);
  console.log('Сгенерированный GUID:', guid);

  // Трансформер для перечислений
  enum Position {
    Programmer = 'Programmer',
    Designer = 'Designer',
    Manager = 'Manager'
  }

  const position = FlexberryEnumTransform.serialize('Programmer', Position);
  console.log('Перечисление:', position);
}

/**
 * Пример использования хранилищ
 */
export async function exampleStores(): Promise<void> {
  // Онлайн хранилище
  const onlineStore = new OnlineStore('https://api.example.com');

  try {
    // Создание записи
    const newRecord = await onlineStore.createRecord('employees', {
      name: 'Иван Петров',
      position: 'Программист'
    });
    console.log('Созданная запись в онлайн хранилище:', newRecord);

    // Локальное хранилище
    const localStore = new LocalStore('my-local-db', 1);

    // Создание записи в локальном хранилище
    const localRecord = await localStore.createRecord('employees', {
      id: '1',
      name: 'Иван Петров',
      position: 'Программист'
    });
    console.log('Созданная запись в локальном хранилище:', localRecord);

  } catch (error) {
    console.error('Ошибка при работе с хранилищами:', error);
  }
}

/**
 * Пример использования сервисов
 */
export function exampleServices(): void {
  // Для примера SyncerService нужна зависимость
  // const syncer = new SyncerService(onlineStore, offlineStore);
  const offlineGlobals = new OfflineGlobalsService();
  const user = new UserService();

  console.log('Сервисы созданы успешно');
}

/**
 * Пример использования контейнера зависимостей
 */
export function exampleContainer(): void {
  // Регистрация сервисов
  container.register('syncer', SyncerService, true); // синглтон
  container.register('user', UserService, false); // не синглтон

  // Получение сервисов
  const syncer1 = container.get('syncer');
  const syncer2 = container.get('syncer');
  console.log('Сервисы синглтоны:', syncer1 === syncer2); // true

  const user1 = container.get('user');
  const user2 = container.get('user');
  console.log('Сервисы не синглтоны:', user1 === user2); // false
}

/**
 * Полный пример использования всей системы
 */
export async function fullExample(): Promise<void> {
  console.log('=== Пример полного использования ===');

  // Используем трансформеры
  exampleTransforms();

  // Используем сериализаторы
  exampleSerializers();

  // Используем хранилища
  await exampleStores();

  // Используем сервисы
  exampleServices();

  // Используем контейнер
  exampleContainer();

  console.log('=== Пример завершен ===');
}
