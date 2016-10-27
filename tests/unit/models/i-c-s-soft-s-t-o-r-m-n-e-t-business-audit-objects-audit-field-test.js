import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', 'Unit | Model | audit-field', {
  needs: [
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
