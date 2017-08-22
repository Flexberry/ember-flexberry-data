import executeTest from './execute-odata-test';
import readingBuilderFunctions from '../base/base-reading-builder-test';

executeTest('reading | builder functions', (store, assert) => {
  readingBuilderFunctions(store, assert);
});
