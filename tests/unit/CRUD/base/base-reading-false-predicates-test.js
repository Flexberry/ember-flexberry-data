import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { FalsePredicate, SimplePredicate, DetailPredicate } from 'ember-flexberry-data/query/predicate';

export default function readingPredicatesFalsePredicates(store, assert) {
  assert.expect(7);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Contains.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user');

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') != null), 'Contains with correct data | Data');
        assert.equal(data.get('length'), 4, 'Contains with correct data | Length');
      });
    })

    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new FalsePredicate());

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 0, `Must return 0 records`);

        let sp1 = new SimplePredicate('name', FilterOperator.Eq, 'Vasya1');
        let tp1 = new FalsePredicate();
        let cp1 = sp1.or(tp1);
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where(cp1);

        return store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 1, `Must return all records`);

          let sp1 = new SimplePredicate('name', FilterOperator.Eq, 'Vasya1');
          let tp1 = new FalsePredicate();
          let cp1 = sp1.and(tp1);
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where(cp1);

          return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 0, `Must return 0 record`);

            let dp = new DetailPredicate('userVotes').any(new FalsePredicate());
            let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp)
            .selectByProjection('CommentE');

            return store.query('ember-flexberry-dummy-comment', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 0, `return 0 record when use any`);

              let dp = new DetailPredicate('userVotes').all(new FalsePredicate());
              let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp)
              .selectByProjection('CommentE');

              return store.query('ember-flexberry-dummy-comment', builder.build())
              .then((data) => {
                assert.equal(data.get('length'), 0, `return 0 record when use all`);
              });
            });
          });
        });
      });
    })
    .catch((e) => {
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  // Attrs for creating suggestion.
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya1',
      eMail: '1@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya2',
      eMail: '2@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Andrey3',
      eMail: '3@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg4',
      eMail: '4@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Type 1',
    }).save()
  ])

  // Сreating suggestion.
  .then((sugAttrs) =>
    store.createRecord('ember-flexberry-dummy-suggestion', {
      type: sugAttrs[4],
      author: sugAttrs[0],
      editor1: sugAttrs[1]
    }).save()

    // Creating comments.
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
          suggestion: sug
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrs[1],
          text: 'Comment 3',
          suggestion: sug
        }).save(),

        store.createRecord('ember-flexberry-dummy-comment', {
          author: sugAttrs[1],
          text: 'Comment 4',
          suggestion: sug
        }).save()
      ])

      // It is necessary to fill 'detail' at 'master' in offline.
      .then((comments) => store._isOnline() ? Ember.RSVP.resolve(comments) : sug.save().then(() => Ember.RSVP.resolve(comments)))

      // Creating votes.
      .then((comments) =>
        Ember.RSVP.Promise.all([
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[3],
            comment: comments[0]
          }).save(),
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[2],
            comment: comments[0]
          }).save(),
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[2],
            comment: comments[0]
          }).save(),
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[3],
            comment: comments[1]
          }).save(),
          store.createRecord('ember-flexberry-dummy-comment-vote', {
            applicationUser: sugAttrs[1],
            comment: comments[2]
          }).save()
        ])

        // It is necessary to fill 'detail' at 'master' in offline.
        .then(() => Ember.RSVP.all(store._isOnline() ? [] : comments.map(comment => comment.save())))

        .then(() =>
          new  Ember.RSVP.Promise((resolve) =>
            resolve({
              people: sugAttrs.slice(0, 4).map(item => item.get('id')),
              comments: comments.map(item => item.get('id'))
            })
          )
        )
      )
    )
  );
}
