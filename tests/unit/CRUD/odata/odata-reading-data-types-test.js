import executeTest from './execute-odata-test';
import readingDataTypes from '../base/base-reading-data-types-test';

executeTest('reading | data types', (store, assert, App) => {
  readingDataTypes(store, assert, App);
});
