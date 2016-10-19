import executeTest from './execute-offline-test';
import readingRestrictionsOnFields from '../base/base-reading-restrictions-on-fields-test';

executeTest('reading | restrictions | on fields', (store, assert) => {
  readingRestrictionsOnFields(store, assert);
});
