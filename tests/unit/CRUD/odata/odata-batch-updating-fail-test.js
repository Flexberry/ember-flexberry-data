import executeTest from './execute-odata-test';
import batchUpdateWithFail from '../base/base-batch-updating-fail-test';

executeTest('batchUpdating-fail', (store, assert) => {
  batchUpdateWithFail(store, assert);
});
