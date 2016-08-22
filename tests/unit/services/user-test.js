import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { Offline } from 'ember-flexberry-data';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleFor('service:user', 'Unit | Service | user', {
  needs: [
    'model:i-c-s-soft-s-t-o-r-m-n-e-t-security-agent',
  ],

  beforeEach() {
    App = startApp();
    App.unregister('service:store');
    App.register('service:store', Offline.Store);
    App.register('store:local', Offline.LocalStore);
  },

  afterEach() {
    Ember.run(App, 'destroy');
  },
});

test('it works', function(assert) {
  assert.expect(4);
  let done = assert.async();
  let service = this.subject(App.__container__.ownerInjection());

  Ember.run(() => {
    service.getCurrentUser().then((user) => {
      assert.equal(user.get('name'), 'user');
      assert.ok(user.get('isUser'));
      assert.notOk(user.get('isGroup'));
      assert.notOk(user.get('isRole'));
      done();
    });
  });
});
