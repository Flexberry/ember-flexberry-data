import executeTest from './execute-offline-test';
import readingPredicatesTruePredicates from '../base/base-reading-true-predicates-test';

executeTest('reading | predicates | true predicates', (store, assert) => {
  readingPredicatesTruePredicates(store, assert);
});
