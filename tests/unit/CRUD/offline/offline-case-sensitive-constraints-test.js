import executeTest from './execute-offline-test';
import baseCaseSensitiveConstraintsTest from '../base/base-case-sensitive-constraints-test';

executeTest('Offline|Limitations that are case-sensitive', (store, assert) => {
  baseCaseSensitiveConstraintsTest(store, assert);
});
