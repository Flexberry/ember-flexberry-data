import { moduleForModel, test } from 'ember-qunit';

moduleForModel('audit-entity', 'Unit | Model | audit-entity', {
  needs: [
    'model:audit-field',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
