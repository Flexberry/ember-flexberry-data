import { module, test } from 'qunit';

import Information from 'ember-flexberry-data/utils/information';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');
const information = new Information(store);

module('utils');

test('information | constructor', function (assert) {
  assert.throws(() => new Information(), Error);
  assert.throws(() => new Information(''), Error);
  assert.throws(() => new Information('store'), Error);
  assert.ok(new Information(store));
});

test('information | isMaster | exceptions', function (assert) {
  assert.throws(() => information.isMaster('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.isMaster('customer', 'unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'manager.unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'manager.manager.unknownfield'), Error);
});

test('information | isMaster | own attribute', function (assert) {
  assert.ok(information.isMaster('customer', 'manager'));
  assert.notOk(information.isMaster('customer', 'firstName'));
  assert.notOk(information.isMaster('customer', 'id'));
});

test('information | isMaster | relationship', function (assert) {
  assert.notOk(information.isMaster('customer', 'manager.First Name'));
  assert.ok(information.isMaster('customer', 'manager.manager'));
  assert.ok(information.isMaster('customer', 'manager.manager.manager'));
  assert.notOk(information.isMaster('customer', 'manager.manager.manager.First Name'));
  assert.notOk(information.isMaster('customer', 'manager.manager.manager.id'));
});

test('information | getType | exceptions', function (assert) {
  assert.throws(() => information.getType('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.getType('customer', 'unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'manager.unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'manager.manager.unknownfield'), Error);
});

test('information | getType | own', function (assert) {
  assert.equal(information.getType('customer', 'manager'), 'employee');
  assert.equal(information.getType('customer', 'firstName'), 'string');
  assert.equal(information.getType('customer', 'id'), 'string');
});

test('information | getType | relationships', function (assert) {
  assert.equal(information.getType('customer', 'manager.First Name'), 'string');
  assert.equal(information.getType('customer', 'manager.manager'), 'employee');
  assert.equal(information.getType('customer', 'manager.manager.manager'), 'employee');
  assert.equal(information.getType('customer', 'manager.manager.manager.First Name'), 'string');
  assert.equal(information.getType('customer', 'manager.manager.manager.id'), 'string');
});
