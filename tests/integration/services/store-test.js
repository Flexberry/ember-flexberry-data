import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from 'dummy/tests/helpers/start-app';

let App;

moduleFor('service:store', 'Integration | Service | store', {
  beforeEach() {
    App = startApp();
  },

  afterEach() {
    Ember.run(App, 'destroy');
  },
});

test('create unload create', function(assert) {
  let done = assert.async();
  Ember.run(() => {
    let store = App.__container__.lookup('service:store');
    store.get('offlineGlobals').setOnlineAvailable(false);
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Man',
      eMail: 'man@example.com',
    }).save().then((record) => {
      let id = record.get('id');
      store.unloadRecord(record);
      assert.ok(store.createRecord('ember-flexberry-dummy-application-user', {
        id: id,
        name: 'SuperMan',
        eMail: 'super.man@example.com',
      }), 'It is a place for SuperMan.');
    }).finally(done);
  });
});
