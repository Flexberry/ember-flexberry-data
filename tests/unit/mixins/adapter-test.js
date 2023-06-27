import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import AdapterMixin from 'ember-flexberry-data/mixins/adapter';

module('Unit | Mixin | adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  let AdapterObject = EmberObject.extend(AdapterMixin);
  let subject = AdapterObject.create();
  assert.ok(subject);
});
