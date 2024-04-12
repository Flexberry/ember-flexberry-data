import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | object-type', function(hooks) {
  setupTest(hooks);

  test('it serializes records', function(assert) {
    run(() => {
      let store = this.owner.lookup('service:store');
      let record = store.createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type');
      let serializedRecord = record.serialize();
      assert.ok(serializedRecord);
    });
  });
});
