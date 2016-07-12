import { module, test } from 'qunit';
import Projection from 'ember-flexberry-data';
import Offline from 'ember-flexberry-data';

module('index tests');

test('index exports', function (assert) {
  assert.ok(Projection.Store);
  assert.ok(Projection.Adapter);
  assert.ok(Projection.Model);
  assert.ok(Projection.create);
  assert.ok(Projection.attr);
  assert.ok(Projection.belongsTo);
  assert.ok(Projection.hasMany);
  assert.ok(Offline.Model);
  assert.ok(Offline.Store);
  assert.ok(Offline.ModelMixin);
  assert.ok(Offline.Adapter);
  assert.ok(Offline.Serializer);
  assert.ok(Offline.GlobalsService);
  assert.ok(Offline.Syncer);
});
