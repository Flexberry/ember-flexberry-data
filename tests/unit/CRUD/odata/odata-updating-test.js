import executeTest from './execute-odata-test';
import updating from '../base/base-updating-test';

executeTest('updating', (store, assert) => {
  updating(store, assert);
});
