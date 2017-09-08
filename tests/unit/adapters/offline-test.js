import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:offline', 'Unit | Adapter | offline', {
  needs: [
    'service:dexie',
  ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject({
    databaseName: 'test'
  });
  assert.ok(adapter);
});
