import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { InPredicate } from 'ember-flexberry-data/query/predicate';

export default function readingComplexPredicates(store, assert) {
  assert.expect(3);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    .then(() => {
      let filterArrayValues = ['Vasya', 'SpiderMan', 'Batman'];
      let ip = new InPredicate('name', filterArrayValues);

      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where(ip);
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 1, `Predicate "in" | Length`);
        assert.ok(data.any(item => item.get('name') === 'Vasya'), `Predicate "in" | Data`);
      });
    })

    .then(() => {
      let filterArrayValues = ['CaptainAmerica', 'SpiderMan', 'Batman'];
      let ip = new InPredicate('name', filterArrayValues);

      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where(ip);
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 0, `Predicate "out" | Length`);
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
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
      karma: 4
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '2@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '3@mail.ru',
      karma: 7
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Andrey',
      eMail: '4@mail.ru',
      karma: 6
    }).save()
  ]);
}
