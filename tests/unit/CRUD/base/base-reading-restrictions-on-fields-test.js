import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { DetailPredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';

export default function readingRestrictionsOnFields(store, assert) {
  assert.expect(6);
  let done = assert.async();

  run(() => {
    initTestData(store)

    // Reading by master field.
    .then((records) => {
      let authorId = records.people[0];
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
        .where('author.id', '==', authorId)
        .selectByProjection('CommentE');

      return store.query('ember-flexberry-dummy-comment', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('author.id') === authorId), 'Reading by master field | Data');
        assert.equal(data.get('length'), 2, 'Reading by master field | Length');
        return records;
      });
    })

    // Reading with master restrictions.
    .then((records) => {
      let commentId = records.comments[2];

      let sp1 = new StringPredicate('author.name').contains('Kolya');
      let sp2 = new StringPredicate('text').contains('Comment 3');
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
        .where(sp1.and(sp2));

      return store.query('ember-flexberry-dummy-comment', builder.build())
      .then((data) => {
        assert.equal(data.get('firstObject.id'), commentId, 'Restrictions on master fields | Data');
        assert.equal(data.get('length'), 1, 'Restrictions on master fields | Length');
      });
    })

    // Reading with detail restrictions.
    .then(() => {
      let dp = new DetailPredicate('userVotes').any(new StringPredicate('applicationUser.name').contains('Oleg'));
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
        .where(dp)
        .selectByProjection('CommentE');

      return store.query('ember-flexberry-dummy-comment', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('author.name') === 'Vasya'), 'Restrictions on details fields | Data');
        assert.equal(data.get('length'), 2, 'Restrictions on details fields | Length');
      });
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  // Attrs for creating suggestion.
  return RSVP.Promise.all([
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
  .then((sugAttrs) =>
    store.createRecord('ember-flexberry-dummy-suggestion', {
      type: sugAttrs[4],
      author: sugAttrs[0],
      editor1: sugAttrs[1]
    }).save()

    // Creating comments.
    .then((sug) =>
      RSVP.Promise.all([
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
      .then((comments) => store._isOnline() ? RSVP.resolve(comments) : sug.save().then(() => RSVP.resolve(comments)))

      // Creating votes.
      .then((comments) =>
        RSVP.Promise.all([
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
        .then(() => RSVP.all(store._isOnline() ? [] : comments.map(comment => comment.save())))

        .then(() =>
          new  RSVP.Promise((resolve) =>
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
