import executeTest from './execute-offline-test';
import readingPredicatesStringPredicates from '../base/base-reading-string-predicates-test';

executeTest('reading | predicates | string predicates', (store, assert) => {
  readingPredicatesStringPredicates(store, assert);
});
