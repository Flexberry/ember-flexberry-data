import executeTest from './execute-offline-test';
import deleting from '../base/base-deleting-test';

executeTest('deleting', (store, assert) => {
  deleting(store, assert);
});
