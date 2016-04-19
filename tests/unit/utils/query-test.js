import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import DS from 'ember-data';

import getQuery from 'ember-flexberry-projections/utils/query';
import Proj from 'ember-flexberry-projections';

let App;

let employeeSerializer = DS.RESTSerializer.extend({
  primaryKey: 'EmployeeID',
  keyForAttribute: function (attr) {
    return Ember.String.capitalize(attr);
  }
});

let orderSerializer = DS.RESTSerializer.extend({
  primaryKey: 'OrderID',
  keyForAttribute: function (attr) {
    return Ember.String.capitalize(attr);
  }
});

module('query tests', {
  setup: function () {
    App = startApp();
    App.register('serializer:employee', employeeSerializer);
    App.register('serializer:order', orderSerializer);
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

test('query for projection', function (assert) {
  let projection = Proj.create('employee', {
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
  let query = getQuery(projection, store);
  assert.equal(
    query.$select,
    'EmployeeID,FirstName,LastName,BirthDate,Employee1,Order,TmpChildren');
  assert.strictEqual(
    query.$expand,
    'Employee1($select=EmployeeID,FirstName),Order($select=OrderID,OrderDate),' +
    'TmpChildren($select=EmployeeID,LastName)');
});
