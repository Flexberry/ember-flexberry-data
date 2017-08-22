import executeTest from './execute-offline-test';
import readingStoreCommands from '../base/base-reading-store-commands-test';

executeTest('reading | store commands', (store, assert) => {
  readingStoreCommands(store, assert);
});
