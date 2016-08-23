import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', 'Unit | Model | audit-entity', {
  needs: [
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type',
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
