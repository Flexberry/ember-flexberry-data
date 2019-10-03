import executeTest from './execute-offline-test';
import batchUpdating from '../base/base-batch-updating-test';

executeTest('batchUpdating', (store, assert) => {
  batchUpdating(store, assert);
});
