import executeTest from './execute-odata-test';
import deleting from '../base/base-deleting-with-details-test';

executeTest('deletingWithDetails', (store, assert) => {
  deleting(store, assert);
});
