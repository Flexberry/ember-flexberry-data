import executeTest from './execute-odata-test';
import baseCaseSensitiveConstraintsTest from '../base/base-case-sensitive-constraints-test';

executeTest('OData|Limitations that are case-sensitive', (store, assert) => {
  baseCaseSensitiveConstraintsTest(store, assert);
});
