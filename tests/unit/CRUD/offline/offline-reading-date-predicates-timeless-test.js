import executeTest from './execute-offline-test';
import readingPredicatesDatePredicatesTimelessOperators from '../base/base-reading-date-predicates-timeless-test';

executeTest('reading | predicates | date predicates | timeless', (store, assert) => {
  readingPredicatesDatePredicatesTimelessOperators(store, assert);
});
