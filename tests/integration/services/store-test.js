import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Integration | Service | store', function(hooks) {
  setupApplicationTest(hooks);

  test('create unload create', function(assert) {
    let done = assert.async();

    let store = this.owner.lookup('service:store');
    store.offlineGlobals.setOnlineAvailable(false);
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
