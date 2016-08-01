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

          .then(() => {
            return store.findRecord('ember-flexberry-dummy-application-user', id)
              .then((editedRecord) => {
                assert.equal(editedRecord.get('name'), 'User 1', 'Without relationships');
                
                // Rollback changes.
                return store.findRecord('ember-flexberry-dummy-application-user', id)
                  .then((returnedRecord) => {
                    returnedRecord.set('name', 'Vasya');
                    return returnedRecord.save();
                  });
              });
          })
          .then(() => ids);
      })

      // With master relationship.
      .then((ids) => {
        let userId = ids[0];
        let commentId = ids[1];
        return store.findRecord('ember-flexberry-dummy-comment', commentId)
          .then((returnedRecord) => {
            returnedRecord.set('author.name', 'User 1');
            return returnedRecord.save();
          })

          .then(() => {
            return store.findRecord('ember-flexberry-dummy-application-user', userId)
              .then((editedRecord) => {
                assert.equal(editedRecord.get('name'), 'User 1', 'With master relationship');
              });
          })
          .then(() => ids);
      })

      // With detail relationship.
      .then((ids) => {
        let commentId = ids[1];
        return store.findRecord('ember-flexberry-dummy-comment', commentId)
          .then((comments) => {
            let vote = comments.get('userVotes').find(item => item.get('applicationUser.name') === 'Oleg');
            vote.set('text', 'Edited Comment');
            return comments.save();
          })

          .then(() => {
            return store.findRecord('ember-flexberry-dummy-comment', commentId)
              .then((editedRecord) => {
                let vote = editedRecord.get('userVotes').find(item => item.get('applicationUser.name') === 'Oleg');
                assert.equal(vote.get('text'), 'Edited Comment', 'With detail relationship');
                
                // Rollback changes.
                return store.findRecord('ember-flexberry-dummy-comment-vote', vote.get('id'))
                  .then((returnedRecord) => {
                    returnedRecord.set('text', 'Comment 3');
                    return returnedRecord.save();
                  });
              });
          })
          .then(() => ids);
      })

      // With 2nd level master relationship.
      .then((ids) => {
        let sugId = ids[2];
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

                // Rollback changes.
                return store.findRecord('ember-flexberry-dummy-suggestion-type', type.get('id'))
                  .then((returnedRecord) => {
                    type.set('name', 'Parent type');
                    return returnedRecord.save();
                  });
              });
          })
          .then(() => ids);
      })

      // With 2nd level detail relationship.
      .then((ids) => {
        let sugId = ids[2];
        let commentId = ids[1];
        return store.findRecord('ember-flexberry-dummy-suggestion', sugId)
          .then((sug) => {
            let comments = sug.get('comments').find(item => item.get('id') === commentId);
            let vote = comments.get('userVotes').find(item => item.get('applicationUser.name') === 'Oleg');
            vote.set('text', 'Edited comment');
            return sug.save();
          })

          .then(() => {
            store.findRecord('ember-flexberry-dummy-suggestion', sugId)
              .then((editedRecord) => {
                let comments = editedRecord.get('comments').find(item => item.get('id') === commentId);
                let vote = comments.get('userVotes').find(item => item.get('applicationUser.name') === 'Oleg');
                assert.equal(vote.get('text'), 'Edited comment',
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
  .then((parentType) => {
    return Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Vasya',
        eMail: '1@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Kolya',
        eMail: '2@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Andrey',
        eMail: '3@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Oleg',
        eMail: '4@mail.ru',
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Type 1',
        parent: parentType
      }).save()
    ]);
  })

  // Сreating suggestion.
  .then((sugAttrsValues) =>
    store.createRecord('ember-flexberry-dummy-suggestion', {
      type: sugAttrsValues[4],
      author: sugAttrsValues[0],
      editor1: sugAttrsValues[1]
    }).save()

    // Creating comments.
    .then((sug) =>
      Ember.RSVP.Promise.all([
        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrsValues[0],
          text: 'Comment 1',
          suggestion: sug,
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrsValues[0],
          text: 'Comment 2',
          suggestion: sug
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrsValues[1],
          text: 'Comment 3',
          suggestion: sug
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrsValues[1],
          text: 'Comment 4',
          suggestion: sug
        }).save()
      ])

        // Creating votes.
        .then((comments) =>
          Ember.RSVP.Promise.all([
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[3],
              comment: comments[0]
            }).save(),
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[2],
              comment: comments[0]
            }).save(),
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[3],
              comment: comments[0]
            }).save(),
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[3],
              comment: comments[1]
            }).save(),
            store.createRecord('ember-flexberry-dummy-comment-vote', {
              applicationUser: sugAttrsValues[1],
              comment: comments[2]
            }).save()
          ])

            .then(() => [
              sugAttrsValues[0].get('id'),
              comments[0].get('id'),
              sug.get('id')
            ])
      )   
    )
  );
}
