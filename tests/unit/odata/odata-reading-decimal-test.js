import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from './execute-odata-CRUD-test';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
      karma: 5.5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '2@mail.ru',
      karma: '5.5'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '3@mail.ru',
      karma: '5,5'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Andrey',
      eMail: '4@mail.ru',
      karma: 4.4
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Dima',
      eMail: '5@mail.ru',
      karma: '4.4'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Tolya',
      eMail: '6@mail.ru',
      karma: '4,4'
    }).save()
  ]);
}

executeTest('reading | decimal', (store, assert) => {
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '==', 5.5);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 3, 'Decimal | length');
            assert.ok(data.any(item => item.get('karma') === 5.5), 'Decimal | data');
          });
      })

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', FilterOperator.Neq, 5.5);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 3);
            assert.equal(data.any(item => item.get('karma'), 4.4));
          });
      })

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', FilterOperator.Ge, 4.4);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 3);
            assert.equal(data.any(item => item.get('karma'), 5.5));
          });
      })

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', FilterOperator.Geq, 4.4);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 6);
          });
      })

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', FilterOperator.Le, 5.5);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 3);
            assert.equal(data.any(item => item.get('karma'), 4.4));
          });
      })

      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', FilterOperator.Leq, 5.5);
        return store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 6);
          });
      })

      .catch(e => console.log(e, e.message))
      .finally(done);
  });
  wait();
});
