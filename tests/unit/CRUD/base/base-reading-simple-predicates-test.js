import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { ConstParam, AttributeParam } from 'ember-flexberry-data/query/parameter';
import { isEmpty } from '@ember/utils';

export default function readingPredicatesSimplePredicatesOperators(store, assert) {
  assert.expect(76);
  let done = assert.async();

  run(() => {
    let builderStrOp = null;
    let builderConstOp = null;

    initTestData(store)

    // Eq.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '==', 5);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Eq, 5));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq with operator | Data', 'Eq with operator | Length'],
          ['Eq with simple predicate | Data', 'Eq with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') === 5), messages[0]);
          assert.equal(data.get('length'), 2, messages[1]);
        }
      );
    })

    // Eq among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('karma'), '==', new ConstParam(5));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('karma'), FilterOperator.Eq, new ConstParam(5)));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq among AttributeParam and ConstParam with operator | Data', 'Eq among AttributeParam and ConstParam with operator | Length'],
          ['Eq among AttributeParam and ConstParam with simple predicate | Data', 'Eq among AttributeParam and ConstParam with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') === 5), messages[0]);
          assert.equal(data.get('length'), 2, messages[1]);
        }
      );
    })

    // Eq among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '==', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Eq, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq among AttributeParams with operator | Data', 'Eq among AttributeParams with operator | Length'],
          ['Eq among AttributeParams with simple predicate | Data', 'Eq among AttributeParams with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') === item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 1, messages[1]);
        }
      );
    })

    // Eq with undefined.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '==', undefined);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Eq, undefined));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq with undefined | Data', 'Eq with undefined | Length'],
          ['Eq with undefined predicate | Data', 'Eq with undefined predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => isEmpty(item.get('karma'))), messages[0]);
          assert.equal(data.get('length'), 0, messages[1]);
        }
      );
    })

    // Neq.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '!=', 5);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Neq, 5));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Neq with operator | Data', 'Neq with operator | Length'],
          ['Neq with simple predicate | Data', 'Neq with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') !== 5), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        }
      );
    })

    // Neq among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('karma'), '!=', new ConstParam(5));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('karma'), FilterOperator.Neq, new ConstParam(5)));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Neq among AttributeParam and ConstParam with operator | Data', 'Neq among AttributeParam and ConstParam with operator | Length'],
          ['Neq among AttributeParam and ConstParam with simple predicate | Data', 'Neq among AttributeParam and ConstParam with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') !== 5), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        }
      );
    })

    // Neq among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '!=', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Neq, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Neq with operator | Data', 'Neq with operator | Length'],
          ['Neq with simple predicate | Data', 'Neq with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') !== item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Ge.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '>', 4);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Ge, 4));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Ge with operator | Data', 'Ge with operator | Length'],
          ['Ge with simple predicate | Data', 'Ge with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') > 4), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Ge among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '>', new ConstParam('Andrey'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Ge, new ConstParam('Andrey')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Ge among AttributeParam and ConstParam with operator | Data', 'Ge among AttributeParam and ConstParam with operator | Length'],
          ['Ge among AttributeParam and ConstParam with simple predicate | Data', 'Ge among AttributeParam and ConstParam with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') > 'Andrey'), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Ge among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '>', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Ge, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Ge among AttributeParams with operator | Data', 'Ge among AttributeParams with operator | Length'],
          ['Ge among AttributeParams with simple predicate | Data', 'Ge among AttributeParams with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') > item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Geq.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '>=', 5);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Geq, 5));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Geq with operator | Data', 'Geq with operator | Length'],
          ['Geq with simple predicate | Data', 'Geq with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') >= 5), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Geq among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '>=', new ConstParam('Kolya'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Geq, new ConstParam('Kolya')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Geq among AttributeParam and ConstParam with operator | Data', 'Geq among AttributeParam and ConstParam with operator | Length'],
          ['Geq among AttributeParam and ConstParam with simple predicate | Data', 'Geq among AttributeParam and ConstParam with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') >= 'Kolya'), messages[0]);
          assert.equal(data.get('length'), 4, messages[1]);
        }
      );
    })

    // Geq among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '>=', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Geq, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Geq among AttributeParams with operator | Data', 'Geq among AttributeParams with operator | Length'],
          ['Geq among AttributeParams with simple predicate | Data', 'Geq among AttributeParams with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') >= item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 5, messages[1]);
        }
      );
    })

    // Le.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '<', 6);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Le, 6));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Le with operator | Data', 'Le with operator | Length'],
          ['Le with simple predicate data', 'Le with simple predicate length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') <  6), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        }
      );
    })

    // Le among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '<', new ConstParam('Kolya'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Le, new ConstParam('Kolya')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Le among AttributeParam and ConstParam with operator | Data', 'Le among AttributeParam and ConstParam with operator | Length'],
          ['Le among AttributeParam and ConstParam with simple predicate | Data', 'Le among AttributeParam and ConstParam with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') < 'Kolya'), messages[0]);
          assert.equal(data.get('length'), 1, messages[1]);
        }
      );
    })

    // Le among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '<', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Le, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Le among AttributeParams with operator | Data', 'Le among AttributeParams with operator | Length'],
          ['Le among AttributeParams with simple predicate | Data', 'Le among AttributeParams with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') < item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 0, messages[1]);
        }
      );
    })

    // Leq.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where('karma', '<=', 5);
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate('karma', FilterOperator.Leq, 5));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Leq with operator | Data', 'Leq with operator | Length'],
          ['Leq with simple predicate | Data', 'Leq with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('karma') <=  5), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        }
      );
    })

    // Leq among AttributeParam and ConstParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '<=', new ConstParam('Kolya'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Leq, new ConstParam('Kolya')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Leq among AttributeParam and ConstParam with operator | Data', 'Leq among AttributeParam and ConstParam with operator | Length'],
          ['Leq among AttributeParam and ConstParam with simple predicate | Data', 'Leq among AttributeParam and ConstParam with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') <= 'Kolya'), messages[0]);
          assert.equal(data.get('length'), 2, messages[1]);
        }
      );
    })

    // Leq among AttributeParams.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new AttributeParam('name'), '<=', new AttributeParam('eMail'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new SimplePredicate(new AttributeParam('name'), FilterOperator.Leq, new AttributeParam('eMail')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Leq among AttributeParams with operator | Data', 'Leq among AttributeParams with operator | Length'],
          ['Leq among AttributeParams with simple predicate | Data', 'Leq among AttributeParams with simple predicate | Length'],
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('name') <= item.get('eMail')), messages[0]);
          assert.equal(data.get('length'), 1, messages[1]);
        }
      );
    })

    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  return RSVP.Promise.all([
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
      name: 'Kolya',
      eMail: '3@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Andrey',
      eMail: '4@mail.ru',
      karma: 6
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'SameData',
      eMail: 'SameData',
      karma: 7
    }).save(),
  ]);
}

function runTest(store, builders, messages, callback) {
  return store.query('ember-flexberry-dummy-application-user', builders[0].build())
  .then((data1) => {
    callback(data1, messages[0]);
    return store.query('ember-flexberry-dummy-application-user', builders[1].build())
    .then((data2) => callback(data2, messages[1]));
  });
}
