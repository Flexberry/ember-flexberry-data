import { module, test } from 'qunit';
import { Projection, Offline, Adapter, Serializer, Query, Utils, Security, Audit } from 'ember-flexberry-data';

module('index tests');

test('index exports', function (assert) {
  assert.ok(Projection.StoreMixin);
  assert.ok(Projection.AdapterMixin);
  assert.ok(Projection.Model);
  assert.ok(Projection.create);
  assert.ok(Projection.attr);
  assert.ok(Projection.belongsTo);
  assert.ok(Projection.hasMany);

  assert.ok(Offline.Model);
  assert.ok(Offline.Store);
  assert.ok(Offline.LocalStore);
  assert.ok(Offline.ModelMixin);
  assert.ok(Offline.GlobalsService);
  assert.ok(Offline.Syncer);

  assert.ok(Adapter.Offline);
  assert.ok(Adapter.Odata);

  assert.ok(Serializer.Offline);
  assert.ok(Serializer.Base);
  assert.ok(Serializer.Odata);

  assert.ok(Query.BaseAdapter);
  assert.ok(Query.BaseBuilder);
  assert.ok(Query.Builder);
  assert.ok(Query.Condition);
  assert.ok(Query.FilterOperator);
  assert.ok(Query.IndexedDbAdapter);
  assert.ok(Query.JsAdapter);
  assert.ok(Query.OdataAdapter);
  assert.ok(Query.OrderByClause);
  assert.ok(Query.BasePredicate);
  assert.ok(Query.SimplePredicate);
  assert.ok(Query.ComplexPredicate);
  assert.ok(Query.StringPredicate);
  assert.ok(Query.DetailPredicate);
  assert.ok(Query.createPredicate);

  assert.ok(Utils.Information);

  assert.ok(Security.UserService);

  assert.ok(Audit.ModelMixin);
});
