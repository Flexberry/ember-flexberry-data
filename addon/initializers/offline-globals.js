export function initialize(application) {
  //Inject OfflieGlobalsService onto factories of specified types.
  [
    'store:local',
    'controller',
    'component',
    'model',
    'route',
    'view',
  ].forEach((type) => {
    application.inject(type, 'offlineGlobals', 'service:offline-globals');
  });
}

export default {
  name: 'offline-globals',
  initialize,
};
