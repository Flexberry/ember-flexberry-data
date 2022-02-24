import executeTest from './execute-odata-test';
import readingPredicatesSimplePredicatesWithMastersOperators from '../base/base-reading-simple-predicates-with-first-level-masters-test';

executeTest('reading with first-level-masters | predicates | simple predicates | operators', (store, assert) => {
  readingPredicatesSimplePredicatesWithMastersOperators(store, assert);
});
