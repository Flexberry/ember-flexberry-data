import executeTest from './execute-offline-test';
import updating from '../base/base-updating-test';

executeTest('updating', (store, assert) => {
  updating(store, assert);
});
