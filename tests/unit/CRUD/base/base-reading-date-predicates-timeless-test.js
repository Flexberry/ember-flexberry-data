import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { DatePredicate } from 'ember-flexberry-data/query/predicate';
import { AttributeParam } from 'ember-flexberry-data/query/parameter';

export default function readingPredicatesDatePredicatesTimelessOperators(store, assert) {
  assert.expect(12);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Date. AttributeParam Eq AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Eq, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toDateString() === item.get('author.birthday').toDateString()), 
          'Reading Date type| AttributeParam Eq AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Eq AttributeParam with Timeless | Length');
      });
    })

    // Date. AttributeParam Neq AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Neq, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toDateString() != item.get('author.birthday').toDateString()), 
          'Reading Date type| AttributeParam Neq AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Neq AttributeParam with Timeless | Length');
      });
    })

    // Date. AttributeParam Le AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Le, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString().substr(0, 10) < item.get('author.birthday').toISOString().substr(0, 10)), 
          'Reading Date type| AttributeParam Le AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Le AttributeParam with Timeless | Length');
      });
    })

    // Date. AttributeParam Leq AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Leq, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString().substr(0, 10) <= item.get('author.birthday').toISOString().substr(0, 10)), 
          'Reading Date type| AttributeParam Leq AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Leq AttributeParam with Timeless | Length');
      });
    })

    // Date. AttributeParam Ge AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Ge, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString().substr(0, 10) > item.get('author.birthday').toISOString().substr(0, 10)), 
          'Reading Date type| AttributeParam Ge AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Ge AttributeParam with Timeless | Length');
      });
    })

    // Date. AttributeParam Geq AttributeParam with Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Geq, new AttributeParam('author.birthday'), true));
      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString().substr(0, 10) >= item.get('author.birthday').toISOString().substr(0, 10)), 
          'Reading Date type| AttributeParam Geq AttributeParam with Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Geq AttributeParam with Timeless | Length');
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
    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Type 1',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
      activated: true,
      birthday: new Date(1974, 10, 12, 13, 14, 0),
      karma: 1.5,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Polikarp',
      eMail: '2@mail.ru',
      activated: false,
      birthday: new Date(1974, 10, 12, 13, 20, 0),
      karma: 2,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Sofokl',
      eMail: '3@mail.ru',
      activated: true,
      birthday: new Date(1974, 10, 12, 13, 10, 0),
      karma: 16.6,
      vip: true
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '4@mail.ru',
      activated: true,
      birthday: new Date(1980, 1, 24, 10, 0, 0),
      karma: 10.7,
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Indapamid',
      eMail: '5@mail.ru',
      activated: true,
      birthday: new Date(1971, 1, 1, 11, 0, 0),
      karma: 16.6,
      vip: true
    }).save()
  ])

  // Сreating suggestion.
  .then((sugAttrsValues) =>
  Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-suggestion', {
      date: new Date(1974, 10, 12, 13, 14, 0),
      type: sugAttrsValues[0],
      author: sugAttrsValues[1],
      editor1: sugAttrsValues[2]
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion', {
      date: new Date(1974, 10, 12, 13, 14, 0),
      type: sugAttrsValues[0],
      author: sugAttrsValues[2],
      editor1: sugAttrsValues[2]
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion', {
      date: new Date(1974, 10, 12, 13, 14, 0),
      type: sugAttrsValues[0],
      author: sugAttrsValues[3],
      editor1: sugAttrsValues[2]
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion', {
      date: new Date(1974, 10, 12, 13, 14, 0),
      type: sugAttrsValues[0],
      author: sugAttrsValues[4],
      editor1: sugAttrsValues[2]
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion', {
      date: new Date(1974, 10, 12, 13, 14, 0),
      type: sugAttrsValues[0],
      author: sugAttrsValues[5],
      editor1: sugAttrsValues[2]
    }).save()
  ])
  );
}
