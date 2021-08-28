import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, DatePredicate } from 'ember-flexberry-data/query/predicate';
import { ConstParam, AttributeParam } from 'ember-flexberry-data/query/parameter';

export default function readingDataTypes(store, assert, App) {
  assert.expect(13);
  let done = assert.async();
  let vasyaRecordsCount = 2;

  Ember.run(() => {
    initTestData(store)

    // String. Attribute and Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('name', FilterOperator.Eq, 'Vasya'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type| Attribute and Const | Data');
        assert.equal(data.get('length'), vasyaRecordsCount, 'Reading String type | Attribute and Const | Length');
      });
    })

    // String. ConstParam with equal Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new ConstParam('Vasya'), FilterOperator.Eq, 'Vasya'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') >= vasyaRecordsCount, 'Reading String type | ConstParam with equal Const | Length');
      });
    })

    // String. ConstParam with not equal Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new ConstParam('name'), FilterOperator.Eq, 'Vasya'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') == 0, 'Reading String type | ConstParam with not equal Const | Length');
      });
    })

    // String. AttributeParam with Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Eq, 'Vasya'));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type | AttributeParam with Const | Data');
        assert.equal(data.get('length'), vasyaRecordsCount, 'Reading String type | AttributeParam with Const | Length');
      });
    })

    // String. ConstParam with AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new ConstParam('Vasya'), FilterOperator.Eq, new AttributeParam('name')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type | ConstParam with AttributeParam | Data');
        assert.equal(data.get('length'), vasyaRecordsCount, 'Reading String type | ConstParam with AttributeParam | Length');
      });
    })

    // String. ConstParam with equal ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new ConstParam('Vasya'), FilterOperator.Eq, new ConstParam('Vasya')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') >= vasyaRecordsCount, 'Reading String type | ConstParam with equal ConstParam | Length');
      });
    })

    // String. ConstParam with not equal Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new ConstParam('name'), FilterOperator.Eq, new ConstParam('Vasya')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') == 0, 'Reading String type | ConstParam with not equal ConstParam | Length');
      });
    })

    // String. AttributeParam and same AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Eq, new AttributeParam('name')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') >= vasyaRecordsCount, 'Reading String type | AttributeParam and same AttributeParam | Length');
      });
    })

    // String. AttributeParam and AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Eq, new AttributeParam('email')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === item.get('email')), 'Reading String type | AttributeParam and AttributeParam | Data');
        assert.equal(data.get('length'), 1, 'Reading String type | AttributeParam and AttributeParam | Length');
      });
    })

    // String. AttributeParam and ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Eq, new ConstParam('Vasya')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type | AttributeParam and ConstParam | Data');
        assert.equal(data.get('length'), vasyaRecordsCount, 'Reading String type | AttributeParam and ConstParam | Length');
      });
    })

    // String. Attribute and same AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('name', FilterOperator.Eq, new AttributeParam('name')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') >= vasyaRecordsCount, 'Reading String type | Attribute and same AttributeParam | Length');
      });
    })

    // String. Attribute and AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('name', FilterOperator.Eq, new AttributeParam('email')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === item.get('email')), 'Reading String type | Attribute and AttributeParam | Data');
        assert.equal(data.get('length'), 1, 'Reading String type | Attribute and AttributeParam | Length');
      });
    })

    // String. Attribute and ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('name', FilterOperator.Eq, new ConstParam('Vasya')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading String type | Attribute and ConstParam | Data');
        assert.equal(data.get('length'), vasyaRecordsCount, 'Reading String type | Attribute and ConstParam | Length');
      });
    })

    // Boolean. Attribute and Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('activated', FilterOperator.Eq, true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) =>
        assert.equal(data.get('length'), 2, `Reading Boolean type | Attribute and Const | Length`)
      );
    })

    // Boolean. Attribute and ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('activated', FilterOperator.Eq, new ConstParam(true)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) =>
        assert.equal(data.get('length'), 2, `Reading Boolean type | Attribute and ConstParam | Length`)
      );
    })

    // Boolean. AttributeParam and AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('activated'), FilterOperator.Eq, new AttributeParam('vip')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) =>
        assert.equal(data.get('length'), 1, `Reading Boolean type | AttributeParam and AttributeParam | Length`)
      );
    })

    // Decimal. Attribute and Const.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Eq, 10.7));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 1, `Reading Decimal type | Attribute and Const | Length`);
        assert.equal(data.get('firstObject').get('name'), 'Kolya', `Reading Decimal type | Attribute and Const | Data`);
      });
    })

    // Decimal. Attribute and ConstParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Eq, new ConstParam(10.7)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 1, `Reading Decimal type | Attribute and ConstParam | Length`);
        assert.equal(data.get('firstObject').get('name'), 'Kolya', `Reading Decimal type | Attribute and ConstParam | Data`);
      });
    })

    // Decimal. AttributeParam and AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('karma'), FilterOperator.Eq, new AttributeParam('karma')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.get('length') > 0, `Reading Decimal type | AttributeParam and AttributeParam | Length`);
      });
    })

    // Date as JavaScript Date. Attribute and Date.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('birthday', FilterOperator.Eq, new Date(1974, 10, 12, 13, 14, 0)));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date type as JavaScript date | Attribute and Date | Data');
        assert.equal(data.get('length'), 2, `Reading Date type as JavaScript date | Attribute and Date | Length`);
      });
    })

    // Date as JavaScript Date. AttributeParam and AttributeParam.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('birthday'), FilterOperator.Eq, new AttributeParam('birthday')));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('length') > 0, `Reading Date type as JavaScript date | AttributeParam and AttributeParam | Length`);
      });
    })

    // Date as JavaScript Date. Attribute and ConstParam Date.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('birthday', FilterOperator.Eq, new ConstParam(new Date(1974, 10, 12, 13, 14, 0))));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date type as JavaScript date | Attribute and ConstParam Date | Data');
        assert.equal(data.get('length'), 2, `Reading Date type as JavaScript date | Attribute and ConstParam Date | Length`);
      });
    })

    // Date as JavaScript Date. AttributeParam and ConstParam Date.
    .then(() => {
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('birthday'), FilterOperator.Eq, new ConstParam(new Date(1974, 10, 12, 13, 14, 0))));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date type as JavaScript date | AttributeParam and ConstParam Date | Data');
        assert.equal(data.get('length'), 2, `Reading Date type as JavaScript date | AttributeParam and ConstParam Date | Length`);
      });
    })

    // Date as String with some format.
    .then(() => {
      let moment = App.__container__.lookup('service:moment');
      let dateBirth = moment.moment(new Date(1974, 10, 12, 13, 14, 0)).format('YYYY-MM-DDTHH:mmZ');
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate('birthday', FilterOperator.Eq, dateBirth));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Vasya'), 'Reading Date as String with some format| Data');
        assert.equal(data.get('length'), 2, `Reading Date as String with some format | Length`);
      });
    })

    // Timeless date as String with some format.
    .then(() => {
      let moment = App.__container__.lookup('service:moment');
      let dateBirth = moment.moment(new Date(1980, 1, 24, 0, 0, 0)).format('YYYY-MM-DD');
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new DatePredicate('birthday', FilterOperator.Eq, dateBirth, true));

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.ok(data.every(item => item.get('name') === 'Kolya'), 'Reading timeless Date as String with some format| Data');
        assert.equal(data.get('length'), 1, `Reading timeless Date as String with some format | Length`);
      });
    })

    // Defferent types in complex.
    .then(() => {
      let predicate = new ComplexPredicate(Condition.And, ...[
          new DatePredicate('birthday', FilterOperator.Eq, new Date(1974, 10, 12, 13, 14, 0)),
          new SimplePredicate('activated', FilterOperator.Eq, true),
          new SimplePredicate('karma', FilterOperator.Eq, 1.5)
      ]);

      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(predicate);

      return store.query('ember-flexberry-dummy-application-user', builder.build())
      .then((data) => {
        assert.equal(data.get('firstObject').get('name'), 'Vasya', `Reading different types in complex | Data`);
        assert.equal(data.get('length'), 1, `Reading different types in complex | Length`);
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
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'EqualRecord',
      eMail: 'EqualRecord',
      activated: true,
      birthday: new Date(2021, 8, 27, 11, 0, 0),
      karma: 16.6,
      vip: true
    }).save()
  ]);
}
