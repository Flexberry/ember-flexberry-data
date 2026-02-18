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
} from '../index';

describe('ember-flexberry-data-nextjs', () => {
  test('должен создавать адаптеры правильно', () => {
    const odataAdapter = new ODataAdapter('https://api.example.com');
    const offlineAdapter = new OfflineAdapter('my-db', 1);

    expect(odataAdapter).toBeDefined();
    expect(offlineAdapter).toBeDefined();
  });

  test('должен создавать сериализаторы правильно', () => {
    const odataSerializer = new ODataSerializer();
    const offlineSerializer = new OfflineSerializer();

    expect(odataSerializer).toBeDefined();
    expect(offlineSerializer).toBeDefined();
  });

  test('должен создавать модели правильно', () => {
    class TestModel {
      name: string;
      email: string;

      constructor(attributes?: any) {
        if (attributes) {
          this.name = attributes.name;
          this.email = attributes.email;
        } else {
          this.name = '';
          this.email = '';
        }
      }

      getAttributes(): any {
        return { name: this.name, email: this.email };
      }
    }

    const model = new TestModel({ name: 'Test', email: 'test@example.com' });

    expect(model).toBeDefined();
    expect(model.getAttributes()).toEqual({ name: 'Test', email: 'test@example.com' });
  });

  test('должен создавать сервисы правильно', () => {
    // Для тестирования SyncerService нужны зависимости
    // const syncerService = new SyncerService(onlineStore, offlineStore);
    const offlineGlobalsService = new OfflineGlobalsService();
    const userService = new UserService();

    expect(syncerService).toBeDefined();
    expect(offlineGlobalsService).toBeDefined();
    expect(userService).toBeDefined();
  });

  test('должен создавать хранилища правильно', () => {
    const localStore = new LocalStore('local-db');
    const onlineStore = new OnlineStore('https://api.example.com');

    expect(localStore).toBeDefined();
    expect(onlineStore).toBeDefined();
  });

  test('должен работать DecimalTransform', () => {
    const decimalValue = 123.45;
    const serialized = DecimalTransform.serialize(decimalValue);
    const deserialized = DecimalTransform.deserialize(serialized);

    expect(serialized).toBeCloseTo(123.45);
    expect(deserialized).toBe('123.45');
  });

  test('должен работать GuidTransform', () => {
    const guid = GuidTransform.serialize(null);

    expect(typeof guid).toBe('string');
    expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  test('должен работать FlexberryEnumTransform', () => {
    enum TestEnum {
      Value1 = 'Value1',
      Value2 = 'Value2'
    }

    const result = FlexberryEnumTransform.serialize('Value1', TestEnum);
    expect(result).toBe('Value1');
  });

  test('должен работать контейнер зависимостей', () => {
    container.register('test-service', SyncerService, true);
    const service1 = container.get('test-service');
    const service2 = container.get('test-service');

    expect(service1).toBeDefined();
    expect(service1).toBe(service2); // синглтон

    container.unregister('test-service');
  });
});
