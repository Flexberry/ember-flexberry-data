import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import executeTest from './execute-odata-CRUD-test';

executeTest('reading | predicates | complex predicates', (store, assert) => {
  assert.expect(4);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Or.
      .then(() => {
        let SP1 = new SimplePredicate('name', '==', 'Vasya');
        let SP2 = new SimplePredicate('karma', '==', 6);
        let CP = SP1.or(SP2);

        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(CP);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 2, `Predicate "or" | Length`);
            assert.ok(data.any(item => item.get('name') === 'Vasya') &&
              data.any(item => item.get('karma') === 6),
              `Predicate "or" | Data`);
          });
      })

      // And.
      .then(() => {
        let SP1 = new SimplePredicate('name', '==', 'Oleg');
        let SP2 = new SimplePredicate('karma', '==', 7);
        let CP = SP1.and(SP2);

        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(CP);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 1, `Predicate "and" | Length`);
          assert.ok(data.every(item => item.get('name') === 'Oleg' &&
            item.get('karma') === 7),
          `Predicate "and" | Data`);
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
