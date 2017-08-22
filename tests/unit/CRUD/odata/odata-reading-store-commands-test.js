import executeTest from './execute-odata-test';
import readingStoreCommands from '../base/base-reading-store-commands-test';

executeTest('reading | store commands', (store, assert) => {
  readingStoreCommands(store, assert);
});
