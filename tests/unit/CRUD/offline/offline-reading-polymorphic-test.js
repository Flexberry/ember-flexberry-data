import executeTest from './execute-offline-test';
import readingPolymorphic from '../base/base-reading-polymorphic-test';

executeTest('reading | polymorphic', (store, assert, App) => {
  readingPolymorphic(store, assert, App);
});
