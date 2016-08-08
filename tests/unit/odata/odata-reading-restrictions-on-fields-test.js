import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { DetailPredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';
import executeTest from './execute-odata-CRUD-test';

executeTest('reading | restrictions | on fields', (store, assert) => {
  assert.expect(6);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Reading by master field.
      .then((records) => {
        let authorId = records[0];
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
          .where('author.id', '==', authorId);

        return store.query('ember-flexberry-dummy-comment', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 2, 'Reading by master field | Length');
            assert.ok(data.every(item => item.get('author.name') === 'Vasya'),
              'Reading by master field | Data');
            return records;
          });
      })

      // Reading with master restrictions.
      .then((records) => {
        let commentId = records[1];

        let sp1 = new StringPredicate('author.name').contains('Kolya');
        let sp2 = new StringPredicate('text').contains('Comment 3');
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
          .where(sp1.and(sp2));

        return store.query('ember-flexberry-dummy-comment', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 1, 'Restrictions on master fields | Length');
            assert.ok(data.get('firstObject').get('id') === commentId,
              'Restrictions on master fields | Data');
          });
      })

      // Reading with detail restrictions.
      .then(() => {
        let dp = new DetailPredicate('userVotes')
          .any(new StringPredicate('applicationUser.name').contains('Oleg'));
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
          .where(dp);

        return store.query('ember-flexberry-dummy-comment', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 2, 'Restrictions on details fields | Length');
            assert.ok(data.every(item => item.get('author.name') === 'Vasya'),
              'Restrictions on details fields | Data');
          });
      })
      .catch(e => console.log(e, e.message))
      .finally(done);
  });
});

function initTestData(store) {
  // Attrs for creating suggestion.
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
    }).save()
  ])

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
                  applicationUser: sugAttrsValues[2],
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
                  comments.find(item => item.get('text') === 'Comment 3' && item.get('author.name') === 'Kolya')
                    .get('id')
                ])
            )
        )
    );
}