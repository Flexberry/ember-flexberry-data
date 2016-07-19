import Ember from 'ember';
import DS from 'ember-data';
import { module, test } from 'qunit';

import { Query } from 'ember-flexberry-data';

import startApp from '../../helpers/start-app';

const { Builder } = Query;

let App;

module('query', {
  setup: function () {
    App = startApp();
    App.register('serializer:employee', DS.RESTSerializer.extend({
      primaryKey: 'EmployeeID',
      keyForAttribute: function (attr) {
        return Ember.String.capitalize(attr);
      }
    }));
    App.register('serializer:order', DS.RESTSerializer.extend({
      primaryKey: 'OrderID',
      keyForAttribute: function (attr) {
        return Ember.String.capitalize(attr);
      }
    }));
  },
  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

test('query builder | constructor', function (assert) {
  let store = App.__container__.lookup('service:store');
  assert.ok(new Builder(store, 'Customer'));
  assert.ok(new Builder(store).from('Customer'));

  assert.ok(new Builder(store, 'Customer').where('Name', 'eq', 'Vasya'));
});

test('query builder | projection', function (assert) {
  // Arrange.
  let store = App.__container__.lookup('service:store');
  let builder = new Builder(store, 'Employee');

  // Act.
  builder.selectByProjection('EmployeeTestProjection');
  let result = builder.build();

  // Assert.
  assert.ok(result);
  assert.equal(result.projectionName, 'EmployeeTestProjection');
  assert.equal(
    result.select,
    'EmployeeID,FirstName,LastName,BirthDate,Employee1,Order,TmpChildren');
  assert.strictEqual(result.expand[0], 'Employee1($select=EmployeeID,FirstName)');
  assert.strictEqual(result.expand[1], 'Order($select=OrderID,OrderDate)');
  assert.strictEqual(result.expand[2], 'TmpChildren($select=EmployeeID,LastName)');
});
