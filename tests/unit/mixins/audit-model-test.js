import Ember from 'ember';
import AuditModelMixin from 'ember-flexberry-data/mixins/audit-model';
import { module, test } from 'qunit';

module('Unit | Mixin | audit model');

test('it works', function(assert) {
  let AuditModelObject = Ember.Object.extend(AuditModelMixin);
  let subject = AuditModelObject.create();
  assert.ok(subject);
});
