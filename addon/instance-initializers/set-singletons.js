export function initialize(appInstance) {
  appInstance.registerOptionsForType('adapter', { singleton: true });
  appInstance.registerOptionsForType('serializer', { singleton: true });
  appInstance.registerOptionsForType('store', { singleton: true });
  appInstance.registerOptionsForType('transform', { singleton: true });
  appInstance.registerOptionsForType('service', { singleton: true });
}

export default {
  name: 'set-singletons',
  initialize
};
