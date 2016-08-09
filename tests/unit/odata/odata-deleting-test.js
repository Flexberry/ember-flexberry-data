import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from './execute-odata-CRUD-test';

executeTest('deleting', (store, assert) => {
  assert.expect(4);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Without relationships.
    .then((records) => {
      store.unloadAll();
      let voteId = records.votes[0];
      return store.findRecord('ember-flexberry-dummy-comment-vote', voteId)
      .then((vote) => {
        vote.deleteRecord();
        return vote.save();
      })

      .then(() => {
        let builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-comment-vote')
          .selectByProjection('CommentVoteE');
        return store.query('ember-flexberry-dummy-comment-vote', builder.build());
      })

      .then((votes) =>
        assert.equal(votes.get('length'), 2, 'Without relationships')
      )

      .then(() => records);
    })

    // With 1st level detail relationship.
    .then((records) => {
      store.unloadAll();
      let commentId = records.comment;

      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-comment')
        .where('id', '==', commentId)
        .selectByProjection('CommentE');
      return store.query('ember-flexberry-dummy-comment', builder.build())
      .then((comments) => {
        let comment = comments.get('firstObject');
        let vote = comment.get('userVotes').find(item => item.get('id') === records.votes[1]);
        vote.deleteRecord();
        return vote.save();
      })

      .then(() => {
        store.unloadAll();
        return store.query('ember-flexberry-dummy-comment', builder.build());
      })
      .then((comments) => {
        let votes = comments.get('firstObject.userVotes');
        assert.equal(votes.get('length'), 1, 'With 1st level detail relationship');
      })

      .then(() => records);
    })

    // With 2nd level detail relationship.
    .then((records) => {
      store.unloadAll();
      let sugId = records.suggestion;

      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-suggestion')
        .where('id', '==', sugId)
        .selectByProjection('SuggestionE');
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      
      .then((sugs) => {
        let comment = sugs.get('firstObject.comments.firstObject');

        builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-comment')
          .where('id', '==', comment.get('id'))
          .selectByProjection('CommentE');
        return store.query('ember-flexberry-dummy-comment', builder.build());
      })

      .then((comments) => {
        let vote = comments.get('firstObject.userVotes.firstObject');
        vote.deleteRecord();
        return vote.save();
      })

      .then(() => {
        store.unloadAll();
        return store.query('ember-flexberry-dummy-comment', builder.build());
      })
      .then((comments) => {
        let votes = comments.get('firstObject.userVotes');
        assert.equal(votes.get('length'), 0, 'With 2nd level detail relationship');
      })

      .then(() => records);
    })
    

    // With master relationship.
    .then((records) => {
      store.unloadAll();
      let commentId = records.comment;
      let userId = records.people[0];
      return store.findRecord('ember-flexberry-dummy-comment', commentId)
      .then((comment) => {
        comment.deleteRecord();
        return comment.save();
      })

      .then(() => {
        store.unloadAll();
        return store.findAll('ember-flexberry-dummy-comment');
      })
      .then((comments) =>
        store.findRecord('ember-flexberry-dummy-application-user', userId)
        .then((user) =>
          assert.ok(comments.get('length') === 0 && user, 'With master relationship')
        )
      );
    })
    .catch(e => console.log(e, e.message))
    .finally(done);
  });
});

function initTestData(store) {

  // Parent type
  return store.createRecord('ember-flexberry-dummy-suggestion-type', {
    name: 'Parent type'
  }).save()

  // Attrs for creating suggestion.
  .then((parentType) =>
    Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Vasya',
        eMail: '1@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Kolya',
        eMail: '2@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Oleg',
        eMail: '3@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Type 1',
        parent: parentType
      }).save()
    ])
  )

  // Сreating suggestion.
  .then((sugAttrs) =>
    store.createRecord('ember-flexberry-dummy-suggestion', {
      type: sugAttrs[3],
      author: sugAttrs[0],
      editor1: sugAttrs[1]
    }).save()

    // Creating comments.
    .then((sug) =>
      store.createRecord('ember-flexberry-dummy-comment', {
        author: sugAttrs[0],
        text: 'Comment 1',
        suggestion: sug,
      }).save()

      // Creating votes.
      .then((commentItem) =>
        Ember.RSVP.Promise.all([
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[0],
            comment: commentItem
          }).save(),

          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[1],
            comment: commentItem
          }).save(),

          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[2],
            comment: commentItem
          }).save()
        ])

        // Returns.
        .then((votes) =>
          new Ember.RSVP.Promise(resolve =>
            resolve({
              people: sugAttrs.slice(0, 3).map(item => item.get('id')),
              type: sugAttrs[3].get('id'),
              suggestion: sug.get('id'),
              comment: commentItem.get('id'),
              votes: votes.map(item => item.get('id'))
            })
          )
        )
      )
    )
  );
}
