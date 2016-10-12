import Ember from 'ember';
import { module, test } from 'qunit';
import AdapterMixin from 'ember-flexberry-data/mixins/adapter';

module('Unit | Mixin | adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  let AdapterObject = Ember.Object.extend(AdapterMixin);
  let subject = AdapterObject.create();
  assert.ok(subject);
});
