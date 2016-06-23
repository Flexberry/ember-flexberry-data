import { module, test } from 'qunit';

import Information from 'ember-flexberry-data/utils/information';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');

module('utils');

test('information | constructor', function (assert) {
  assert.throws(() => new Information(), Error);
  assert.throws(() => new Information(''), Error);
  assert.throws(() => new Information('store'), Error);
  assert.ok(new Information(store));
});

test('information | isMaster | exceptions', function (assert) {
  let information = new Information(store);

  assert.throws(() => information.isMaster('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.isMaster('customer', 'unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'manager.unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'manager.manager.unknownfield'), Error);
});

test('information | isMaster | own', function (assert) {
  let information = new Information(store);

  assert.ok(information.isMaster('customer', 'manager'));
  assert.notOk(information.isMaster('customer', 'firstName'));
});

test('information | isMaster | relationships', function (assert) {
  let information = new Information(store);

  assert.notOk(information.isMaster('customer', 'manager.First Name'));
  assert.ok(information.isMaster('customer', 'manager.manager'));
  assert.ok(information.isMaster('customer', 'manager.manager.manager'));
  assert.notOk(information.isMaster('customer', 'manager.manager.manager.First Name'));
});

test('information | getType | exceptions', function (assert) {
  let information = new Information(store);

  assert.throws(() => information.getType('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.getType('customer', 'unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'manager.unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'manager.manager.unknownfield'), Error);
});

test('information | getType | own', function (assert) {
  let information = new Information(store);

  assert.equal(information.getType('customer', 'manager'), 'employee');
  assert.equal(information.getType('customer', 'firstName'), 'string');
});

test('information | getType | relationships', function (assert) {
  let information = new Information(store);

  assert.equal(information.getType('customer', 'manager.First Name'), 'string');
  assert.equal(information.getType('customer', 'manager.manager'), 'employee');
  assert.equal(information.getType('customer', 'manager.manager.manager'), 'employee');
  assert.equal(information.getType('customer', 'manager.manager.manager.First Name'), 'string');
});
