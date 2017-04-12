import executeTest from './execute-odata-test';
import baseConstraintsNotCaseSensitiveTest from '../base/base-constraints-not-case-sensitive-test';

executeTest('OData|Limitations that are not case-sensitive', (store, assert) => {
  baseConstraintsNotCaseSensitiveTest(store, assert);
});
