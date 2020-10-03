import executeTest from './execute-offline-test';
import readingPredicatesCustomPredicates from '../base/base-reading-custom-predicates-test';

executeTest('reading | predicates | custom predicates', (store, assert) => {
  readingPredicatesCustomPredicates(store, assert);
});
