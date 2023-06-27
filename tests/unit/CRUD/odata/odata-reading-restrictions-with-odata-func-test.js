import executeTest from './execute-odata-test';
import readingRestrictionsOdataFunctions from '../base/base-reading-restrictions-with-odata-func-test';

const skip = true;

executeTest('reading | restrictions | odata functions', (store, assert) => {
  readingRestrictionsOdataFunctions(store, assert);
}, skip);
