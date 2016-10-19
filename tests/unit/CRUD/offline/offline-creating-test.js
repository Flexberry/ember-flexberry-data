import executeTest from './execute-offline-test';
import baseCreatingTest from '../base/base-creating-test';

executeTest('creating', (store, assert) => {
  baseCreatingTest(store, assert);
});
