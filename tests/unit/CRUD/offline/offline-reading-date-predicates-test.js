import executeTest from './execute-offline-test';
import readingPredicatesDatePredicatesOperators from '../base/base-reading-date-predicates-test';

executeTest('reading | predicates | date predicates | operators', (store, assert) => {
  readingPredicatesDatePredicatesOperators(store, assert);
});
