import executeTest from './execute-odata-test';
import deleting from '../base/base-deleting-test';

executeTest('deleting', (store, assert) => {
  deleting(store, assert);
});
