import executeTest from './execute-odata-test';
import batchUpdating from '../base/base-batch-updating-test';

executeTest('batchUpdating', (store, assert) => {
  batchUpdating(store, assert);
});
