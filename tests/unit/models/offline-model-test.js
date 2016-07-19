import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

import startApp from '../../helpers/start-app';

let App;

moduleForModel('offline-model', 'Unit | Model | offline model', {
  // Specify the other units that are required for this test.
  needs: [],

  beforeEach() {
    App = startApp();
  },

  afterEach() {
    Ember.run(App, 'destroy');
  }
});

test('it exists', function(assert) {
  let model = this.subject();

  // let store = this.store();
  assert.ok(!!model);
});

test('projections have addintional metadata', function(assert) {
  let store = App.__container__.lookup('service:store');
  const EmployeeOffline = store.modelFor('employee-offline');
  const projectionName = 'EmployeeTestProjection';
  let projection = Ember.get(EmployeeOffline, 'projections')[projectionName];

  assert.ok(!Ember.isNone(EmployeeOffline.projections), 'there is no projections in model "employee-offline"');
  assert.ok(!Ember.isNone(projection), 'projection "EmployeeTestProjection" is absent');
  assert.ok(!Ember.isNone(projection.attributes.createTime), '"EmployeeTestProjection.createTime" metadata property is absent');
  assert.ok(!Ember.isNone(projection.attributes.employee1.attributes.createTime),
    '"EmployeeTestProjection.employee1.createTime" metadata property is absent (for belongsTo relationship)');
  assert.ok(!Ember.isNone(projection.attributes.tmpChildren.attributes.createTime),
    '"EmployeeTestProjection.tmpChildren.createTime" metadata property is absent (for hasMany relationship)');
});
