import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-security-session', 'Unit | Serializer | session', {
  needs: [
    'serializer:i-c-s-soft-s-t-o-r-m-n-e-t-security-session',
  ],
});

test('it serializes records', function(assert) {
  let record = this.subject();
  let serializedRecord = record.serialize();
  assert.ok(serializedRecord);
});
