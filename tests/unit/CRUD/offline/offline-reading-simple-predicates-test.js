import executeTest from './execute-offline-test';
import readingPredicatesSimplePredicatesOperators from '../base/base-reading-simple-predicates-test';

executeTest('reading | predicates | simple predicates | operators', (store, assert) => {
  readingPredicatesSimplePredicatesOperators(store, assert);
});
