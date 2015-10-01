import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import DS from 'ember-data';

import ProjectionQuery from 'ember-flexberry-projections/utils/projection-query';
import Proj from 'ember-flexberry-projections/utils/projection-attributes';
import Projection from 'ember-flexberry-projections/utils/projection';

let App;

let employeeSerializer = DS.RESTSerializer.extend({
  primaryKey: 'EmployeeID',
  keyForAttribute: function(attr) {
    return Ember.String.capitalize(attr);
  }
});

let orderSerializer = DS.RESTSerializer.extend({
  primaryKey: 'OrderID',
  keyForAttribute: function(attr) {
    return Ember.String.capitalize(attr);
  }
});

module('ProjectionQuery tests', {
  setup: function() {
    App = startApp();
    App.register('serializer:employee', employeeSerializer);
    App.register('serializer:order', orderSerializer);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('query for projection', function(assert) {
  let projection = Projection.create('employee', {
    firstName: Proj.attr('First Name'),
    lastName: Proj.attr('Last Name'),
    birthDate: Proj.attr('Birth Date'),
    employee1: Proj.belongsTo('employee', 'Reports To', {
      firstName: Proj.attr('Reports To - First Name')
    }),
    order: Proj.belongsTo('order', 'Order', {
      orderDate: Proj.attr('Order Date')
    }),
    tmpChildren: Proj.hasMany('employee', 'Tmp Children', {
      lastName: Proj.attr('Tmp Children - Last Name')
    })
  });

  let store = App.__container__.lookup('service:store');
  let query = ProjectionQuery.get(projection, store);
  assert.equal(query.$select, 'EmployeeID,FirstName,LastName,BirthDate,Employee1,Order,TmpChildren');
  assert.strictEqual(query.$expand, 'Employee1($select=EmployeeID,FirstName),Order($select=OrderID,OrderDate),TmpChildren($select=EmployeeID,LastName)');
});
