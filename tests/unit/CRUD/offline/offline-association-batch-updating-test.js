import executeTest from './execute-offline-test';
import associationBatchUpdating from '../base/association-batch-updating-test';

executeTest('associationBatchUpdating', (store, assert) => {
  associationBatchUpdating(store, assert);
});
