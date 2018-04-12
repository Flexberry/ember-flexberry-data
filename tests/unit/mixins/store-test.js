import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import StoreMixin from 'ember-flexberry-data/mixins/store';

module('Unit | Mixin | store');

// Replace this with your real tests.
test('it works', function(assert) {
  let StoreObject = EmberObject.extend(StoreMixin);
  let subject = StoreObject.create();
  assert.ok(subject);
});
