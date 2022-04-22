import executeTest from './execute-odata-test';
import readingPredicatesDatePredicatesTimelessOperators from '../base/base-reading-date-predicates-timeless-test';

const skip = true;

executeTest('reading | predicates | date predicates | timeless', (store, assert) => {
  readingPredicatesDatePredicatesTimelessOperators(store, assert);
}, skip);
