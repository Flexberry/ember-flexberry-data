import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | base', function(hooks) {
  setupTest(hooks);

  test('it serializes records', function(assert) {
    run(() => {
      let store = this.owner.lookup('service:store');
      let record = store.createRecord('model');
      let serializedRecord = record.serialize();
      assert.ok(serializedRecord);
    });
  });
});
