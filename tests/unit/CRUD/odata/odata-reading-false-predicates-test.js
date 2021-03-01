import executeTest from './execute-odata-test';
import readingPredicatesFalsePredicates from '../base/base-reading-false-predicates-test';

const skip = true;

executeTest('reading | predicates | false predicates', (store, assert) => {
  readingPredicatesFalsePredicates(store, assert);
}, skip);
