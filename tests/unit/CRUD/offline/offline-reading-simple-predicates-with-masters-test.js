import executeTest from './execute-offline-test';
import readingPredicatesSimplePredicatesWithMastersOperators from '../base/base-reading-simple-predicates-with-masters-test';

executeTest('reading with masters | predicates | simple predicates | operators', (store, assert) => {
  readingPredicatesSimplePredicatesWithMastersOperators(store, assert);
});