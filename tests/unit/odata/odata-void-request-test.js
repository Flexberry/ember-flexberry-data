import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import startApp from '../../helpers/start-app';


moduleFor('adapter:odata', 'Unit | Adapter | odata | void request', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});

test('void functions test', function(assert) {
  let done = assert.async();
  const app = startApp();
  const adapter = OdataAdapter.create(app.__container__.ownerInjection());

  Ember.run(() => {
    return adapter.callAction('ExecuteVoidAction', { }, null)
    .then((msg) => {
      assert.equal(msg, undefined, "Method returned UNDEFINED as expected.")
    })
    .catch(e => {
      console.log(e, e.message);
      assert.ok(false, e.message);
    })
    .finally(done);
  });
  wait();
});
