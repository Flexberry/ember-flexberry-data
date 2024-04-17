import { isNone } from '@ember/utils';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | offline model', function(hooks) {
  setupTest(hooks);

  test('projections have addintional metadata', function(assert) {
    let store = this.owner.lookup('service:store');
    const EmployeeOffline = store.modelFor('employee-offline');
    const projectionName = 'EmployeeTestProjection';
    let projection = get(EmployeeOffline, 'projections')[projectionName];

    assert.ok(!isNone(EmployeeOffline.projections), 'there is no projections in model "employee-offline"');
    assert.ok(!isNone(projection), 'projection "EmployeeTestProjection" is absent');
    assert.ok(!isNone(projection.attributes.createTime), '"EmployeeTestProjection.createTime" metadata property is absent');
    assert.ok(!isNone(projection.attributes.employee1.attributes.createTime),
      '"EmployeeTestProjection.employee1.createTime" metadata property is absent (for belongsTo relationship)');
    assert.ok(!isNone(projection.attributes.tmpChildren.attributes.createTime),
      '"EmployeeTestProjection.tmpChildren.createTime" metadata property is absent (for hasMany relationship)');
  });
});
