import Ember from 'ember';
import executeTest from './execute-odata-CRUD-test';

executeTest('updating', (store, assert) => {
  assert.expect(5);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Without relationships.
      .then((ids) => {
        let id = ids[0];
        return store.findRecord('ember-flexberry-dummy-application-user', id)
          .then((returnedRecord) => {
            returnedRecord.set('name', 'User 1');
            return returnedRecord.save();
          })

          .then(() =>
            store.findRecord('ember-flexberry-dummy-application-user', id)
              .then((editedRecord) => {
                assert.equal(editedRecord.get('name'), 'User 1', 'Without relationships');
              })
          )
          .then(() => ids);
      })

      // With master relationship.
      .then((ids) => {
        let userId = ids[0];
        let commentId = ids[2];
        return store.findRecord('ember-flexberry-dummy-comment', commentId)
          .then((returnedRecord) => {
            returnedRecord.set('author.name', 'User 1');
            return returnedRecord.save();
          })

          .then(() =>
            store.findRecord('ember-flexberry-dummy-application-user', userId)
              .then((editedRecord) => {
                assert.equal(editedRecord.get('name'), 'User 1', 'With master relationship');
              })
          )
          .then(() => ids);
      })

      // With detail relationship.
      .then((ids) => {
        let newUserId = ids[0];
        let oldUserId = ids[1];
        let commentId = ids[2];

        return store.findRecord('ember-flexberry-dummy-comment', commentId)
          .then((comment) =>
            store.findRecord('ember-flexberry-dummy-application-user', newUserId)
              .then((newUser) => {
                let vote = comment.get('userVotes').find(item => item.get('applicationUser.id') === oldUserId);
                vote.set('applicationUser', newUser);
                return comment.save();
              })
          )

          .then(() =>
            store.findRecord('ember-flexberry-dummy-comment', commentId)
              .then((editedRecord) => {
                let vote = editedRecord.get('userVotes').objectAt(1);
                assert.equal(vote.get('applicationUser.id'), newUserId, 'With detail relationship');

                // Rollback changes.
                return store.findRecord('ember-flexberry-dummy-comment-vote', vote.get('id'))
                  .then((returnedRecord) => {
                    store.findRecord('ember-flexberry-dummy-application-user', oldUserId)
                      .then((oldUser) =>
                        returnedRecord.set('applicationUser', oldUser)
                      );
                    return returnedRecord.save();
                  });
              })
          )
          .then(() => ids);
      })

      // With 2nd level master relationship.
      .then((ids) => {
        let sugId = ids[3];
        return store.findRecord('ember-flexberry-dummy-suggestion', sugId)
          .then((sug) => {
            sug.get('type.parent').set('name', 'Edited type');
            return sug.save();
          })

          .then(() => {
            store.findRecord('ember-flexberry-dummy-suggestion', sugId)
              .then((editedRecord) => {
                let type = editedRecord.get('type.parent');
                assert.equal(type.get('name'), 'Edited type',
                  'With 2nd level master relationship');
              });
          })
          .then(() => ids);
      })

      // With 2nd level detail relationship.
      .then((ids) => {
        let newUserId = ids[0];
        let oldUserId = ids[1];
        let commentId = ids[2];
        let sugId = ids[3];
        return store.findRecord('ember-flexberry-dummy-suggestion', sugId)
          .then((sug) =>
            store.findRecord('ember-flexberry-dummy-application-user', newUserId)
              .then((newUser) => {
                let comments = sug.get('comments').find(item => item.get('id') === commentId);
                let vote = comments.get('userVotes').find(item => item.get('applicationUser.id') === oldUserId);
                vote.set('applicationUser', newUser);
                return sug.save();
              })
          )

          .then(() => {
            store.findRecord('ember-flexberry-dummy-suggestion', sugId)
              .then((editedRecord) => {
                let comments = editedRecord.get('comments').find(item => item.get('id') === commentId);
                let vote = comments.get('userVotes').objectAt(1);
                assert.equal(vote.get('applicationUser.id'), newUserId,
                  'With 2nd level detail relationship');
              });
          });
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

            .then(() => [
              sugAttrsValues[0].get('id'),
              sugAttrsValues[2].get('id'),
              commentItem.get('id'),
              sug.get('id')
            ])
      )
    )
  );
}
