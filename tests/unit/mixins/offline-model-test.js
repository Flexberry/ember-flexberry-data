import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';

module('Unit | Mixin | offline model');

// Replace this with your real tests.
test('it works', function(assert) {
  let OfflineModelObject = EmberObject.extend(OfflineModelMixin);
  let subject = OfflineModelObject.create();
  assert.ok(subject);
});
