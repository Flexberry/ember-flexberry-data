import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { TruePredicate } from 'ember-flexberry-data/query/predicate';

export default function readingPredicatesTruePredicates(store, assert) {
  assert.expect(3);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Contains.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user');

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') != null), 'Contains with correct data | Data');
        assert.equal(data.get('length'), 3, 'Contains with correct data | Length');
      });
    })

    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new TruePredicate());

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) =>
        assert.equal(data.get('length'), 3, `Must return all records`)
      );
    })
    .catch((e) => {
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '2@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '3@mail.ru',
    }).save()
  ]);
}
