import Ember from 'ember';
import { module, test } from 'qunit';
import StoreMixin from 'ember-flexberry-data/mixins/store';

module('Unit | Mixin | store');

// Replace this with your real tests.
test('it works', function(assert) {
  let StoreObject = Ember.Object.extend(StoreMixin);
  let subject = StoreObject.create();
  assert.ok(subject);
});
