import executeTest from './execute-offline-test';
import readingPredicatesSimplePredicatesWithMastersOperators from '../base/base-reading-simple-predicates-with-first-level-masters-test';

const skip = true;

executeTest('reading with first-level-masters | predicates | simple predicates | operators', (store, assert) => {
  readingPredicatesSimplePredicatesWithMastersOperators(store, assert);
}, skip);