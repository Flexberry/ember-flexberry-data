import executeTest from './execute-odata-test';
import readingPredicatesTruePredicates from '../base/base-reading-true-predicates-test';

const skip = true;

executeTest('reading | predicates | true predicates', (store, assert) => {
  readingPredicatesTruePredicates(store, assert);
}, skip);
