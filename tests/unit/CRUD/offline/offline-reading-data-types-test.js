import executeTest from './execute-offline-test';
import readingDataTypes from '../base/base-reading-data-types-test';

executeTest('reading | data types', (store, assert, App) => {
  readingDataTypes(store, assert, App);
});
