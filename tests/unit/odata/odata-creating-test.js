import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from './execute-odata-CRUD-test';

executeTest('creating', (store, assert) => {
  assert.expect(5);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // With master relationship.
    .then((records) => {
      store.unloadAll();
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-suggestion')
        .where('id', '==', records.suggestion)
        .selectByProjection('SuggestionE');
      return store.query('ember-flexberry-dummy-suggestion', builder.build())

      .then((sug) => {
        let comments = sug.get('firstObject.comments');
        assert.equal(sug.get('firstObject.author.id'), records.user, 'With master relationship');
        assert.equal(comments.get('firstObject.id'), records.comment, 'With 1st level detail relationship | Data');
        assert.equal(comments.get('length'), 1, 'With 1st level detail relationship | Length');

        builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-comment-vote')
          .where('comment.id', '==', records.comment)
          .selectByProjection('CommentVoteE');
        return store.query('ember-flexberry-dummy-comment-vote', builder.build())
        .then((votes) => {
          assert.equal(votes.get('firstObject.applicationUser.id'), records.user, 'With 2nd level detail relationship | Data');
          assert.equal(votes.get('length'), 1, 'With 2nd level detail relationship | Length');
        });
      });
    })
    .catch(e => console.log(e, e.message))
    .finally(done);
  });
});

function initTestData(store) {
  return store.createRecord('ember-flexberry-dummy-application-user', {
    name: 'User 1',
    eMail: 'EMail 1'
  }).save()

  .then((user) =>
    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Suggestion Type'
    }).save()

    .then((type) =>
      store.createRecord('ember-flexberry-dummy-suggestion', {
        type: type,
        author: user,
        editor1: user
      }).save()
    )

    .then((sug) =>
      store.createRecord('ember-flexberry-dummy-comment', {
        author: user,
        text: 'Comment 1',
        suggestion: sug,
      }).save()

      .then((comment) =>
        store.createRecord('ember-flexberry-dummy-comment-vote', {
          applicationUser: user,
          comment: comment
        }).save()

        .then((vote) =>
          new Ember.RSVP.Promise((resolve) =>
            resolve({
              user: user.get('id'),
              suggestion: sug.get('id'),
              comment: comment.get('id'),
              vote: vote.get('id')
            })
          )
        )
      )
    )
  );
}
