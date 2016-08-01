import Ember from 'ember';
import executeTest from './execute-odata-CRUD-test';

executeTest('deleting', (store, assert) => {
  assert.expect(1);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Without relationships.
      .then((ids) => {
        let voteId = ids[3];
        return store.findRecord('ember-flexberry-dummy-comment-vote', voteId)
          .then((vote) => vote.destroyRecord())

          .then(() =>
            store.findRecord('ember-flexberry-dummy-comment-vote', voteId)
              .then((record) => assert.ok(!record))
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
  .then((sugAttrsValues) =>
    store.createRecord('ember-flexberry-dummy-suggestion', {
      type: sugAttrsValues[3],
      author: sugAttrsValues[0],
      editor1: sugAttrsValues[1]
    }).save()

    // Creating comments.
    .then((sug) =>
      store.createRecord('ember-flexberry-dummy-comment', {
        author: sugAttrsValues[0],
        text: 'Comment 1',
        suggestion: sug,
      }).save()

        // Creating votes.
        .then((commentItem) =>
          Ember.RSVP.Promise.all([
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[1],
              comment: commentItem
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[2],
              comment: commentItem
            }).save(),
          ])

            .then((votes) => [
              sugAttrsValues[0].get('id'),
              commentItem.get('id'),
              sug.get('id'),
              votes[0].get('id')
            ])
      )
    )
  );
}
