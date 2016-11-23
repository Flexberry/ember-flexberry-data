import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';

export default function readingDataTypes(store, assert, App) {
  assert.expect(9);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // String.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('name', FilterOperator.Eq, 'Vasya'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type | Data');
        assert.equal(data.get('length'), 2, 'Reading String type | Length');
      });
    })

    // Boolean.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('activated', FilterOperator.Eq, true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) =>
        assert.equal(data.get('length'), 2, `Reading Boolean type | Length`)
      );
    })

    // Decimal.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Eq, 10.7));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 1, `Reading Decimal type | Length`);
        assert.equal(data.get('firstObject').get('name'), 'Kolya', `Reading Decimal type | Data`);
      });
    })

    // Date as JavaScript Date.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('birthday', FilterOperator.Eq, new Date(1974, 10, 12, 13, 14, 0)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date type as JavaScript date | Data');
        assert.equal(data.get('length'), 2, `Reading Date type as JavaScript date | Length`);
      });
    })

    // Date as String with some format.
    .then(() => {
      let moment = App.__container__.lookup('service:moment');
      let dateBirth = moment.moment(new Date(1974, 10, 12, 13, 14, 0)).format('YYYY-MM-DDTHH:mmZ');
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('birthday', FilterOperator.Eq, dateBirth));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date as String with some format| Data');
        assert.equal(data.get('length'), 2, `Reading Date as String with some format | Length`);
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
      activated: true,
      birthday: new Date(1974, 10, 12, 13, 14, 0),
      karma: 1.5,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '2@mail.ru',
      activated: false,
      birthday: new Date(1974, 10, 12, 13, 14, 0),
      karma: 2,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '3@mail.ru',
      activated: true,
      birthday: new Date(1980, 1, 24, 10, 0, 0),
      karma: 10.7,
    }).save()
  ]);
}
