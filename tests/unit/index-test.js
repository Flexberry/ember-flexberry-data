import { module, test } from 'qunit';
import Proj from 'ember-flexberry-projections';

module('index tests');

test('index exports', function(assert) {
  assert.ok(Proj.Store);
  assert.ok(Proj.Adapter);
  assert.ok(Proj.Model);
  assert.ok(Proj.create);
  assert.ok(Proj.attr);
  assert.ok(Proj.belongsTo);
  assert.ok(Proj.hasMany);
});
