import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | audit-field', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = this.owner.lookup('service:store').modelFor('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field');
    assert.ok(!!model);
  });
});
