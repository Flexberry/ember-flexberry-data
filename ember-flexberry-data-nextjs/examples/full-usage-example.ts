/**
 * Полный пример использования всех компонентов библиотеки
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
  QueryObject,
  SimplePredicate,
  FilterOperator,
  container
} from '../src/index';

/**
 * Полный пример использования всей системы
 */
async function fullUsageExample(): Promise<void> {
  console.log('=== Полный пример использования ===\n');

  // 1. Использование адаптеров
  console.log('1. Адаптеры:');
  const odataAdapter = new ODataAdapter('https://api.example.com');
  const offlineAdapter = new OfflineAdapter('my-db', 1);
  console.log('   OData адаптер:', odataAdapter.constructor.name);
  console.log('   Offline адаптер:', offlineAdapter.constructor.name);

  // 2. Использование сериализаторов
  console.log('\n2. Сериализаторы:');
  const odataSerializer = new ODataSerializer();
  const offlineSerializer = new OfflineSerializer();
  console.log('   OData сериализатор:', odataSerializer.constructor.name);
  console.log('   Offline сериализатор:', offlineSerializer.constructor.name);

  // 3. Использование трансформеров
  console.log('\n3. Трансформеры:');
  const decimalValue = DecimalTransform.serialize('123.45');
  console.log('   Decimal transform:', decimalValue);

  const guid = GuidTransform.serialize(null);
  console.log('   GUID transform:', guid);

  // 4. Использование хранилищ
  console.log('\n4. Хранилища:');
  const onlineStore = new OnlineStore('https://api.example.com');
  const localStore = new LocalStore('my-local-db', 1);
  console.log('   Онлайн хранилище:', onlineStore.constructor.name);
  console.log('   Локальное хранилище:', localStore.constructor.name);

  // 5. Использование запросов
  console.log('\n5. Запросы:');
  const query = new QueryObject('employees')
    .setPredicate(new SimplePredicate('name', FilterOperator.Eq, 'Иван Петров'))
    .setSelect(['id', 'name', 'position']);
  console.log('   Query object:', query.constructor.name);

  // 6. Использование сервисов
  console.log('\n6. Сервисы:');
  const offlineGlobals = new OfflineGlobalsService();
  const user = new UserService();
  console.log('   Offline globals service:', offlineGlobals.constructor.name);
  console.log('   User service:', user.constructor.name);

  // 7. Использование контейнера зависимостей
  console.log('\n7. Контейнер зависимостей:');
  container.register('offlineGlobals', OfflineGlobalsService, true);
  container.register('user', UserService, false);

  const service1 = container.get('offlineGlobals');
  const service2 = container.get('offlineGlobals');
  console.log('   Синглтон:', service1 === service2);

  const user1 = container.get('user');
  const user2 = container.get('user');
  console.log('   Не синглтон:', user1 === user2);

  // 8. Использование синхронизации
  console.log('\n8. Синхронизация:');
  // const syncer = new SyncerService(onlineStore, localStore);
  // console.log('   Syncer service:', syncer.constructor.name);

  console.log('\n=== Пример завершен ===');
}

// Запуск примера
fullUsageExample().catch(error => {
  console.error('Ошибка в примере:', error);
});
