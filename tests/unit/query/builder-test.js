import Ember from 'ember';
import { module, test } from 'qunit';

import { Query } from 'ember-flexberry-data';

import startApp from '../../helpers/start-app';

const { Builder } = Query;
let app;
let store;

module('query', {
  setup: function () {
    app = startApp();
    store = app.__container__.lookup('service:store');
  },
  teardown: function () {
    Ember.run(app, 'destroy');
  }
});

test('query builder | constructor', assert => {
  assert.ok(new Builder(store, 'Customer'));
  assert.ok(new Builder(store).from('Customer'));

  assert.ok(new Builder(store, 'Customer').where('Name', 'eq', 'Vasya'));
});

test('query builder | select by projection', assert => {
  // Arrange.
  let builder = new Builder(store, 'ember-flexberry-dummy-comment').selectByProjection('CommentE');

  // Act.
  let result = builder.build();

  // Assert.
  assert.ok(result);
  assert.equal(result.projectionName, 'CommentE');

  assert.ok(result.select);
  assert.ok(result.select.length, 7);
  assert.equal(result.select[0], 'id');
  assert.equal(result.select[1], 'suggestion');
  assert.equal(result.select[2], 'text');
  assert.equal(result.select[3], 'votes');
  assert.equal(result.select[4], 'moderated');
  assert.equal(result.select[5], 'author');
  assert.equal(result.select[6], 'userVotes');

  assert.ok(result.expand);

  assert.ok(result.expand.suggestion);
  assert.ok(result.expand.suggestion.select);
  assert.ok(result.expand.suggestion.expand);
  assert.equal(result.expand.suggestion.select[0], 'id');
  assert.equal(result.expand.suggestion.select[1], 'address');

  assert.ok(result.expand.author);
  assert.ok(result.expand.author.select);
  assert.ok(result.expand.author.expand);
  assert.equal(result.expand.author.select[0], 'id');
  assert.equal(result.expand.author.select[1], 'name');

  assert.ok(result.expand.userVotes);
  assert.ok(result.expand.userVotes.select);
  assert.ok(result.expand.userVotes.expand);
  assert.equal(result.expand.userVotes.select[0], 'id');
});
