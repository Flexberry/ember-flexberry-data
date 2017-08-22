import executeTest from './execute-offline-test';
import readingComparsionWithNull from '../base/base-reading-comparsion-with-null-test';

executeTest('reading | comparsion with null', (store, assert) => {
  readingComparsionWithNull(store, assert);
});
