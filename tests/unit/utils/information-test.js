import { run } from '@ember/runloop';
import { module, test } from 'qunit';

import Information from 'ember-flexberry-data/utils/information';

import startApp from '../../helpers/start-app';

let app;
let store;
let information;

module('utils', {
  beforeEach() {
    app = startApp();
    store = app.__container__.lookup('service:store');
    information = new Information(store);
  },

  afterEach() {
    run(app, 'destroy');
  },
});

test('information | constructor', assert => {
  assert.throws(() => new Information(), Error);
  assert.throws(() => new Information(''), Error);
  assert.throws(() => new Information('store'), Error);
  assert.ok(new Information(store));
});

test('information | isMaster | exceptions', assert => {
  assert.throws(() => information.isMaster('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.isMaster('customer', 'unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'Manager.unknownfield'), Error);
  assert.throws(() => information.isMaster('customer', 'Manager.Manager.unknownfield'), Error);
});

test('information | isMaster | own attribute', assert => {
  assert.notOk(
    information.isMaster('ember-flexberry-dummy-comment', 'id'),
    'Special attribute `id` is not a master.');

  assert.notOk(
    information.isMaster('ember-flexberry-dummy-comment', 'text'),
    'Own attribute `text` is not a master.');

  assert.ok(
    information.isMaster('ember-flexberry-dummy-comment', 'author'),
    'Relationship `belongsTo` is a master.'
  );

  assert.notOk(
    information.isMaster('ember-flexberry-dummy-comment', 'userVotes'),
    'Relationship `hasMany` is not a master.'
  );
});

test('information | isMaster | nested', assert => {
  assert.notOk(information.isMaster('customer', 'Manager.First Name'));
  assert.ok(information.isMaster('customer', 'Manager.Manager'));
  assert.ok(information.isMaster('customer', 'Manager.Manager.Manager'));
  assert.notOk(information.isMaster('customer', 'Manager.Manager.Manager.First Name'));
  assert.notOk(information.isMaster('customer', 'Manager.Manager.Manager.id'));
});

test('information | isEnum | own attribute', assert => {
  assert.ok(information.getMeta('ember-flexberry-dummy-application-user', 'gender').isEnum);
  assert.notOk(information.getMeta('ember-flexberry-dummy-application-user', 'name').isEnum);
});

test('information | isEnum | nested', assert => {
  assert.ok(information.getMeta('ember-flexberry-dummy-comment-vote', 'applicationUser.gender').isEnum);
  assert.notOk(information.getMeta('ember-flexberry-dummy-comment-vote', 'applicationUser.name').isEnum);
});

test('information | getType | exceptions', assert => {
  assert.throws(() => information.getType('unknownmodel', 'firstName'), Error);
  assert.throws(() => information.getType('customer', 'unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'Manager.unknownfield'), Error);
  assert.throws(() => information.getType('customer', 'Manager.Manager.unknownfield'), Error);
});

test('information | getType | own attribute', assert => {
  assert.equal(information.getType('customer', 'id'), 'string');
  assert.equal(information.getType('customer', 'Manager'), 'employee');
  assert.equal(information.getType('customer', 'firstName'), 'string');
});

test('information | getType | nested', assert => {
  assert.equal(information.getType('customer', 'Manager.First Name'), 'string');
  assert.equal(information.getType('customer', 'Manager.Manager'), 'employee');
  assert.equal(information.getType('customer', 'Manager.Manager.Manager'), 'employee');
  assert.equal(information.getType('customer', 'Manager.Manager.Manager.First Name'), 'string');
  assert.equal(information.getType('customer', 'Manager.Manager.Manager.id'), 'string');
});

test('information | isAttribute | own attribute', function (assert) {
  assert.ok(information.isAttribute('ember-flexberry-dummy-suggestion', 'id'));
  assert.ok(information.isAttribute('ember-flexberry-dummy-suggestion', 'address'));
  assert.notOk(information.isAttribute('ember-flexberry-dummy-suggestion', 'author'));
  assert.notOk(information.isAttribute('ember-flexberry-dummy-suggestion', 'userVotes'));
});

test('information | isAttribute | nested', function (assert) {
  assert.ok(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.id'));
  assert.ok(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.name'));
  assert.ok(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.parent.name'));
  assert.notOk(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.parent'));
  assert.notOk(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.parent.parent'));
  assert.notOk(information.isAttribute('ember-flexberry-dummy-suggestion', 'type.localizedTypes'));
});

test('information | isRelationship | own attribute', function (assert) {
  assert.ok(information.isRelationship('ember-flexberry-dummy-suggestion', 'author'));
  assert.ok(information.isRelationship('ember-flexberry-dummy-suggestion', 'userVotes'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'id'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'address'));
});

test('information | isRelationship | nested', function (assert) {
  assert.ok(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.parent'));
  assert.ok(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.parent.parent'));
  assert.ok(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.localizedTypes'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.id'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.name'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.parent.id'));
  assert.notOk(information.isRelationship('ember-flexberry-dummy-suggestion', 'type.parent.name'));
});

test('information | isKey | own attribute', function (assert) {
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'id'));
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'author'));
  assert.notOk(information.isKey('ember-flexberry-dummy-suggestion', 'userVotes'));
  assert.notOk(information.isKey('ember-flexberry-dummy-suggestion', 'address'));
});

test('information | isKey | nested', function (assert) {
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'type.id'));
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'type.parent'));
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'type.parent.id'));
  assert.ok(information.isKey('ember-flexberry-dummy-suggestion', 'type.parent.parent'));
  assert.notOk(information.isKey('ember-flexberry-dummy-suggestion', 'type.localizedTypes'));
  assert.notOk(information.isKey('ember-flexberry-dummy-suggestion', 'type.name'));
  assert.notOk(information.isKey('ember-flexberry-dummy-suggestion', 'type.parent.name'));
});
