import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { EqZeroCustomPredicate } from '../../utils/test-custom-predicate';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

export default function readingPredicatesCustomPredicates(store, assert) {
  assert.expect(5);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    .then(() => {
      const builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new EqZeroCustomPredicate('karma'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('karma') === 0), 'Result with correct data | Data');
        assert.equal(data.get('length'), 2, 'Result with correct data | Length');
      });
    })
    .then(() => {
      const p1 = new SimplePredicate('name', FilterOperator.Eq, 'Vasya');
      const p2 = new EqZeroCustomPredicate('karma');
      const resultPredicate = p2.and(p1);
      const builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(resultPredicate);

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('karma') === 0), 'Result with correct data | Karma');
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Result with correct data | Name');
        assert.equal(data.get('length'), 1, 'Result with correct data | Length');
        done();
      });
    });
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
      karma: 5,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '2@mail.ru',
      karma: 0,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '3@mail.ru',
      karma: 0,
    }).save()
  ]);
}
