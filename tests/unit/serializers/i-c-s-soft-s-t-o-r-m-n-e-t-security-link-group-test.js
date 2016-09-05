import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', 'Unit | Serializer | link-group', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],
});

test('it serializes records', function(assert) {
  let record = this.subject();
  let serializedRecord = record.serialize();
  assert.ok(serializedRecord);
});
