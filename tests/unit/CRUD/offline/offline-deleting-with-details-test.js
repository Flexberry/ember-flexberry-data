import executeTest from './execute-offline-test';
import deleting from '../base/base-deleting-with-details-test';

executeTest('deletingWithDetails', (store, assert) => {
  deleting(store, assert);
});
