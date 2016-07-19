import Syncer from '../syncer';

export function initialize(application) {
  //Register factory for Syncer.
  application.register('syncer:main', Syncer);
}

export default {
  name: 'syncer',
  before: 'ember-data',
  initialize
};
