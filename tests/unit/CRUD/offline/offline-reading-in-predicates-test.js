import executeTest from './execute-offline-test';
import readingInPredicates from '../base/base-reading-in-predicates-test';

executeTest('reading | predicates | in predicates', (store, assert) => {
  readingInPredicates(store, assert);
});
