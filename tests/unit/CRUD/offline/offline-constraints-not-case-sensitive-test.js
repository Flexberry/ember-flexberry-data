import executeTest from './execute-offline-test';
import baseConstraintsNotCaseSensitiveTest from '../base/base-constraints-not-case-sensitive-test';

executeTest('Offline|Limitations that are not case-sensitive', (store, assert) => {
  baseConstraintsNotCaseSensitiveTest(store, assert);
});
