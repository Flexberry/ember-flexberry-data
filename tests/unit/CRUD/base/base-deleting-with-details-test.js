import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

export default function deletingWithDetails(store, assert) {
  assert.expect(3);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Without relationships.
    .then((records) => {
      store.unloadAll();
      let suggestionId = records.suggestion;
      return store.findRecord('ember-flexberry-dummy-suggestion', suggestionId)
      .then((suggestion) => {
        // In offline when delete 'detail' need to update 'master'.
        suggestion.deleteRecord();
        return suggestion.save();
      })

      .then(() => {
        let builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-suggestion')
          .selectByProjection('SuggestionE');
        return store.query('ember-flexberry-dummy-suggestion', builder.build());
      })

      .then((suggestions) => {
        assert.equal(suggestions.get('length'), 0, 'Agregator deleted.');
        let builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-comment')
          .selectByProjection('CommentE');
        return store.query('ember-flexberry-dummy-comment', builder.build());
      })

      .then((comments) =>{
        assert.equal(comments.get('length'), 0, 'First level detail deleted.');
        let builder = new QueryBuilder(store)
          .from('ember-flexberry-dummy-comment-vote')
          .selectByProjection('CommentVoteE');
        return store.query('ember-flexberry-dummy-comment-vote', builder.build());
      })

      .then((commentVotes) =>{
        assert.equal(commentVotes.get('length'), 0, 'Second level detail deleted.');
      })

      .then(() => records);
    })
    .catch((e) => {
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

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

      // It is necessary to fill 'detail' at 'master' in offline.
      .then((commentItem) => store._isOnline() ? Ember.RSVP.resolve(commentItem) : sug.save().then(() => Ember.RSVP.resolve(commentItem)))

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

        // It is necessary to fill 'detail' at 'master' in offline.
        .then((votes) => store._isOnline() ? Ember.RSVP.resolve(votes) : commentItem.save().then(() => Ember.RSVP.resolve(votes)))

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
