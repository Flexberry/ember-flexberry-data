import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import executeTest from './execute-odata-CRUD-test';

executeTest('reading | predicates | string predicates', (store, assert) => {
  assert.expect(4);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Contains.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
      .where(new StringPredicate('name').contains('as'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.ok(data.every(item => item.get('name') === 'Vasya'),
            'Contains with correct data | Data');
          assert.equal(data.get('length'), 2, 'Contains with correct data | Length');
        });
    })

    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
      .where(new StringPredicate('name').contains(null));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 0, 'Contains without data');
        });
    })

    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
      .where(new StringPredicate('name').contains('Ge'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 0, `Contains mustn't return any records`);
        });
    })
    .catch(e => console.log(e, e.message))
    .finally(done);
  });
});

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
      name: 'Kolya',
      eMail: '3@mail.ru',
    }).save()
  ]);
}
