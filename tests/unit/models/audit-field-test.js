import { moduleForModel, test } from 'ember-qunit';

moduleForModel('audit-field', 'Unit | Model | audit-field', {
  needs: [
    'model:audit-entity',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
