import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { DatePredicate } from 'ember-flexberry-data/query/predicate';
import { ConstParam, AttributeParam } from 'ember-flexberry-data/query/parameter';

export default function readingPredicatesDatePredicatesOperators(store, assert) {
  assert.expect(60);
  let done = assert.async();
  let mainCompareDate = new Date(1974, 10, 12, 13, 14, 0);
  let mainCompareDateToString = mainCompareDate.toString();
  let mainCompareDateToDateString = mainCompareDate.toDateString();
  let mainCompareDateISODate = mainCompareDate.toISOString().substr(0, 10);

  Ember.run(() => {
    initTestData(store)

    // Date. AttributeParam Eq ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Eq, new ConstParam(mainCompareDate)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toString() === mainCompareDateToString), 'Reading Date type| AttributeParam Eq ConstParam | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Eq ConstParam | Length');
      });
    })

    // Date. AttributeParam Eq ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Eq, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toDateString() === mainCompareDateToDateString), 'Reading Date type| AttributeParam Eq ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Eq ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Eq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Eq, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toString() === mainCompareDateToString), 'Reading Date type| ConstParam Eq AttributeParam | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| ConstParam Eq AttributeParam | Length');
      });
    })

    // Date. ConstParam Eq AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Eq, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toDateString() === mainCompareDateToDateString), 'Reading Date type| ConstParam Eq AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| ConstParam Eq AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Neq ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Neq, new ConstParam(mainCompareDate)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toString() != mainCompareDateToString), 'Reading Date type| AttributeParam Neq ConstParam | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Neq ConstParam | Length');
      });
    })

    // Date. AttributeParam Neq ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Neq, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toDateString() != mainCompareDateToDateString), 'Reading Date type| AttributeParam Neq ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Neq ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Neq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Neq, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toString() != mainCompareDateToString), 'Reading Date type| ConstParam Neq AttributeParam | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| ConstParam Neq AttributeParam | Length');
      });
    })

    // Date. ConstParam Neq AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Neq, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toDateString() != mainCompareDateToDateString), 'Reading Date type| ConstParam Neq AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| ConstParam Neq AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Le ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Le, new ConstParam(mainCompareDate)));
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') < mainCompareDate), 'Reading Date type| AttributeParam Le ConstParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Le ConstParam | Length');
      });
    })

    // Date. AttributeParam Le ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Le, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) < mainCompareDateISODate), 'Reading Date type| AttributeParam Le ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Le ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Le AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Le, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') > mainCompareDate), 'Reading Date type| ConstParam Le AttributeParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| ConstParam Le AttributeParam | Length');
      });
    })

    // Date. ConstParam Le AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Le, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) > mainCompareDateISODate), 'Reading Date type| ConstParam Le AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| ConstParam Le AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Ge ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Ge, new ConstParam(mainCompareDate)));
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') > mainCompareDate), 'Reading Date type| AttributeParam Ge ConstParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Ge ConstParam | Length');
      });
    })

    // Date. AttributeParam Ge ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Ge, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) > mainCompareDateISODate), 'Reading Date type| AttributeParam Ge ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Ge ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Ge AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Ge, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') < mainCompareDate), 'Reading Date type| ConstParam Ge AttributeParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| ConstParam Ge AttributeParam | Length');
      });
    })

    // Date. ConstParam Ge AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Ge, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) < mainCompareDateISODate), 'Reading Date type| ConstParam Ge AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| ConstParam Ge AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Leq ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Leq, new ConstParam(mainCompareDate)));
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') <= mainCompareDate), 'Reading Date type| AttributeParam Leq ConstParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Leq ConstParam | Length');
      });
    })

    // Date. AttributeParam Leq ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Leq, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) <= mainCompareDateISODate), 'Reading Date type| AttributeParam Leq ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Leq ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Leq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Leq, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') >= mainCompareDate), 'Reading Date type| ConstParam Leq AttributeParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| ConstParam Leq AttributeParam | Length');
      });
    })

    // Date. ConstParam Leq AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Leq, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) >= mainCompareDateISODate), 'Reading Date type| ConstParam Leq AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| ConstParam Leq AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Geq ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Geq, new ConstParam(mainCompareDate)));
      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') >= mainCompareDate), 'Reading Date type| AttributeParam Geq ConstParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Geq ConstParam | Length');
      });
    })

    // Date. AttributeParam Geq ConstParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new AttributeParam('birthday'), FilterOperator.Geq, new ConstParam(mainCompareDate), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) >= mainCompareDateISODate), 'Reading Date type| AttributeParam Geq ConstParam With Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Geq ConstParam With Timeless | Length');
      });
    })

    // Date. ConstParam Geq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Geq, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday') <= mainCompareDate), 'Reading Date type| ConstParam Geq AttributeParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| ConstParam Geq AttributeParam | Length');
      });
    })

    // Date. ConstParam Geq AttributeParam With Timeless.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate(new ConstParam(mainCompareDate), FilterOperator.Geq, new AttributeParam('birthday'), true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('birthday').toISOString().substr(0, 10) <= mainCompareDateISODate), 'Reading Date type| ConstParam Geq AttributeParam With Timeless | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| ConstParam Geq AttributeParam With Timeless | Length');
      });
    })

    // Date. AttributeParam Eq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Eq, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toString() === item.get('author.birthday').toString()), 
          'Reading Date type| AttributeParam Eq AttributeParam | Data');
        assert.equal(data.get('length'), 1, 'Reading Date type| AttributeParam Eq AttributeParam | Length');
      });
    })

    // Date. AttributeParam Neq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Neq, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toString() != item.get('author.birthday').toString()), 
          'Reading Date type| AttributeParam Neq AttributeParam | Data');
        assert.equal(data.get('length'), 4, 'Reading Date type| AttributeParam Neq AttributeParam | Length');
      });
    })

    // Date. AttributeParam Le AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Le, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString() < item.get('author.birthday').toISOString()), 
          'Reading Date type| AttributeParam Le AttributeParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Le AttributeParam | Length');
      });
    })

    // Date. AttributeParam Leq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Leq, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString() <= item.get('author.birthday').toISOString()), 
          'Reading Date type| AttributeParam Leq AttributeParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Leq AttributeParam | Length');
      });
    })

    // Date. AttributeParam Ge AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Ge, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString() > item.get('author.birthday').toISOString()), 
          'Reading Date type| AttributeParam Ge AttributeParam | Data');
        assert.equal(data.get('length'), 2, 'Reading Date type| AttributeParam Ge AttributeParam | Length');
      });
    })

    // Date. AttributeParam Geq AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion')
        .where(new DatePredicate(new AttributeParam('date'), FilterOperator.Geq, new AttributeParam('author.birthday')));

      return store.query('ember-flexberry-dummy-suggestion', builder.build())
      .then((data) => {
        assert.ok(
          data.every(item => item.get('date').toISOString() >= item.get('author.birthday').toISOString()), 
          'Reading Date type| AttributeParam Geq AttributeParam | Data');
        assert.equal(data.get('length'), 3, 'Reading Date type| AttributeParam Geq AttributeParam | Length');
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
