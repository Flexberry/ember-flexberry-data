import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('model', 'Unit | Model | model', {
  needs: [
    'model:ember-flexberry-dummy-suggestion',
    'model:ember-flexberry-dummy-suggestion-type',
    'model:ember-flexberry-dummy-application-user',
    'model:ember-flexberry-dummy-vote',
    'model:ember-flexberry-dummy-suggestion-file',
    'model:ember-flexberry-dummy-comment',
    'model:ember-flexberry-dummy-comment-vote',
    'model:ember-flexberry-dummy-localized-suggestion-type',
    'service:syncer',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();

  // let store = this.store();
  assert.ok(!!model);
});

test('rollback hasMany relationships', function(assert) {
  Ember.run(() => {
    let store = this.store();

    let suggestion = store.createRecord('ember-flexberry-dummy-suggestion');

    let vote1 = store.createRecord('ember-flexberry-dummy-vote');
    let vote2 = store.createRecord('ember-flexberry-dummy-vote');

    let comment1 = store.createRecord('ember-flexberry-dummy-comment');
    let comment2 = store.createRecord('ember-flexberry-dummy-comment');

    //Change `hasMany` relationships.
    suggestion.set('userVotes', [vote1, vote2]);
    suggestion.set('comments', [comment1, comment2]);

    //Diff `hasMany` relationships.
    assert.deepEqual(suggestion.changedHasMany(), {
      userVotes: [[], [vote1, vote2]],
      comments: [[], [comment1, comment2]],
    }, `Results 'changedHasMany' function as expected.`);

    //Rollback `hasMany` for only `userVotes` relationship.
    suggestion.rollbackHasMany('userVotes');
    assert.deepEqual({
      userVotes: suggestion.get('userVotes').map(record => record),
      comments: suggestion.get('comments').map(record => record),
    }, {
      userVotes: [],
      comments: [comment1, comment2],
    }, `Results 'rollbackHasMany' function with 'forOnlyKey' specified as expected.`);

    //Rollback all `hasMany` relationships.
    suggestion.rollbackHasMany();
    assert.deepEqual({
      userVotes: suggestion.get('userVotes').map(record => record),
      comments: suggestion.get('comments').map(record => record),
    }, {
      userVotes: [],
      comments: [],
    }, `Results 'rollbackHasMany' function without 'forOnlyKey' specified as expected.`);
  });
});

test('rollback belongsTo relationships', function(assert) {
  Ember.run(() => {
    let store = this.store();

    let type1 = store.createRecord('ember-flexberry-dummy-suggestion-type');
    let type2 = store.createRecord('ember-flexberry-dummy-suggestion-type');

    let user1 = store.createRecord('ember-flexberry-dummy-application-user');
    let user2 = store.createRecord('ember-flexberry-dummy-application-user');

    let suggestion = store.createRecord('ember-flexberry-dummy-suggestion', {
      type: type1,
      author: user1,
      editor1: user1,
    });

    //Instead of save on server.
    suggestion.didLoad();

    //Change `belongsTo` relationships.
    suggestion.set('type', type2);
    suggestion.set('author', user2);
    suggestion.set('editor1', user2);

    //Diff `belongsTo` relationships.
    assert.deepEqual(suggestion.changedBelongsTo(), {
      type: [type1, type2],
      author: [user1, user2],
      editor1: [user1, user2],
    }, `Results 'changedBelongsTo' function as expected.`);

    //Rollback `belongsTo` for only `type` relationship.
    suggestion.rollbackBelongsTo('type');
    assert.deepEqual({
      type: suggestion.get('type'),
      author: suggestion.get('author'),
      editor1: suggestion.get('editor1'),
    }, {
      type: type1,
      author: user2,
      editor1: user2,
    }, `Results 'rollbackBelongsTo' function with 'forOnlyKey' specified as expected.`);

    //Rollback all `belongsTo` relationships.
    suggestion.rollbackBelongsTo();
    assert.deepEqual({
      type: suggestion.get('type'),
      author: suggestion.get('author'),
      editor1: suggestion.get('editor1'),
    }, {
      type: type1,
      author: user1,
      editor1: user1,
    }, `Results 'rollbackBelongsTo' function without 'forOnlyKey' specified as expected.`);
  });
});

test('changedBelongsTo after saving the created model', function(assert) {
  Ember.run(() => {
    let store = this.store();

    let type1 = store.createRecord('ember-flexberry-dummy-suggestion-type');

    let user1 = store.createRecord('ember-flexberry-dummy-application-user');

    let suggestion = store.createRecord('ember-flexberry-dummy-suggestion', {
      type: type1,
      author: user1,
      editor1: user1,
    });

    //Diff `belongsTo` relationships.
    assert.ok(suggestion.hasChangedBelongsTo());
    assert.deepEqual(suggestion.changedBelongsTo(), {
      type: [null, type1],
      author: [null, user1],
      editor1: [null, user1],
    }, `Results 'changedBelongsTo' function as expected.`);

    //Instead of save on server.
    suggestion.didCreate();

    //Diff `belongsTo` relationships.
    assert.notOk(suggestion.hasChangedBelongsTo());
    assert.deepEqual(suggestion.changedBelongsTo(), {
    }, `Results 'changedBelongsTo' function as expected.`);
  });
});
