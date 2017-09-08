import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', 'Unit | Model | link-group', {
  needs: [
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
    'service:syncer',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
