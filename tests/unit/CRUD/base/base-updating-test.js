import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

export default function updating(store, assert) {
  assert.expect(2);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Without relationships.
    .then((records) => {
      let userId = records.people[0];
      return store.findRecord('ember-flexberry-dummy-application-user', userId)
      .then((returnedRecord) => {
        returnedRecord.set('name', 'User 1');
        return returnedRecord.save();
      })

      .then(() => {
        store.unloadAll();
        return store.findRecord('ember-flexberry-dummy-application-user', userId)
        .then((editedRecord) =>
          assert.equal(editedRecord.get('name'), 'User 1', 'Without relationships')
        );
      })
      .then(() => records);
    })

    // With master relationship.
    .then((records) => {
      store.unloadAll();
      let userId = records.people[1];
      let commentId = records.comments[0];

      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-comment')
        .where('id', '==', commentId)
        .selectByProjection('CommentE');

      return store.query('ember-flexberry-dummy-comment', builder.build())
      .then((comments) => {
        let comment = comments.get('firstObject');
        return store.findRecord('ember-flexberry-dummy-application-user', userId)
        .then((user) => {
          comment.set('author', user);
          return comment.save();
        });
      })

      .then(() => {
        store.unloadAll();
        return store.query('ember-flexberry-dummy-comment', builder.build())
        .then((comments) =>
          assert.equal(comments.get('firstObject.author.id'), userId, 'With master relationship')
        );
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

    // Creating comment.
    .then((sug) =>
      Ember.RSVP.Promise.all([
        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrs[0],
          text: 'Comment 1',
          suggestion: sug,
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrs[0],
          text: 'Comment 2',
          suggestion: sug,
        }).save()
      ])

      // Creating votes.
      .then((comments) =>
        Ember.RSVP.Promise.all([
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[1],
            comment: comments[0]
          }).save(),

          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[2],
            comment: comments[1]
          }).save(),
        ])

        .then((votes) =>
          new Ember.RSVP.Promise((resolve) =>
            resolve({
              people: sugAttrs.slice(0, 3).map(item => item.get('id')),
              comments: comments.map(item => item.get('id')),
              votes: votes.map(item => item.get('id')),
              sug: sug.get('id')
            })
          )
        )
      )
    )
  );
}
