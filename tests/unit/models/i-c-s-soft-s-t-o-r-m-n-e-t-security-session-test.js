import { moduleForModel, test } from 'ember-qunit';

moduleForModel('i-c-s-soft-s-t-o-r-m-n-e-t-security-session', 'Unit | Model | session', {
  needs: [
    'service:syncer',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
