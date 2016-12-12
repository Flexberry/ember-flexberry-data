import executeTest from './execute-odata-test';
import readingPolymorphic from '../base/base-reading-polymorphic-test';

executeTest('reading | polymorphic', (store, assert, App) => {
  readingPolymorphic(store, assert, App);
});
