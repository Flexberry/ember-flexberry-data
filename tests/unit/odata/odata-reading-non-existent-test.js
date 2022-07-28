import Ember from 'ember';
import { module, test } from 'qunit';

module('reading-non-existent-test', {

});

test('reading non-existent entry ', function(assert) {
  let done = assert.async();

  Ember.run(() => {
    fetch('http://localhost:6500/odata/EmberFlexberryDummyDepartaments(146dbe0f-a6d0-4086-a380-6c61b9a8e803)')
    .then(response => {
      console.log(response.status);
      assert.equal(response.status, 404);
    })
    .finally(done);
  });
});
