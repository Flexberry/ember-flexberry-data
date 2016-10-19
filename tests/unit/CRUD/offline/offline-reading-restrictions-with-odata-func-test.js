import executeTest from './execute-offline-test';
import readingRestrictionsOdataFunctions from '../base/base-reading-restrictions-with-odata-func-test';

executeTest('reading | restrictions | odata functions', (store, assert) => {
  readingRestrictionsOdataFunctions(store, assert);
});
