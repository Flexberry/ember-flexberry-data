import Ember from 'ember';
import { module, test } from 'qunit';
import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';

module('Unit | Mixin | offline model');

// Replace this with your real tests.
test('it works', function(assert) {
  let OfflineModelObject = Ember.Object.extend(OfflineModelMixin);
  let subject = OfflineModelObject.create();
  assert.ok(subject);
});
