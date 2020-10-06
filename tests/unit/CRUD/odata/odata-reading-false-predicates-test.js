import executeTest from './execute-odata-test';
import readingPredicatesFalsePredicates from '../base/base-reading-false-predicates-test';

executeTest('reading | predicates | false predicates', (store, assert) => {
  readingPredicatesFalsePredicates(store, assert);
});
