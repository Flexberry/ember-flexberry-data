import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', 'Unit | Serializer | audit-entity', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity',
    'transform:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant',
    'transform:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],
});

test('it serializes records', function(assert) {
  let record = this.subject();
  let serializedRecord = record.serialize();
  assert.ok(serializedRecord);
});
