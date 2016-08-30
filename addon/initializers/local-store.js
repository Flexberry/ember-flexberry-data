import LocalStore from '../stores/local-store';

export function initialize(application) {
  //Register factory for local Store.
  application.register('store:local', LocalStore);
}

export default {
  name: 'local-store',
  before: 'offline-globals',
  initialize
};
