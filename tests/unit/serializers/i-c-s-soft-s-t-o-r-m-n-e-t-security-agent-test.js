import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | agent', function(hooks) {
  setupTest(hooks);

  test('it serializes records', function(assert) {
    run(() => {
      let store = this.owner.lookup('service:store');
      let record = store.createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent');
      let serializedRecord = record.serialize();
      assert.ok(serializedRecord);
    });
  });
});
