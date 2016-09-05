import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', 'Unit | Serializer | object-type', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type',
  ],
});

test('it serializes records', function(assert) {
  let record = this.subject();
  let serializedRecord = record.serialize();
  assert.ok(serializedRecord);
});
